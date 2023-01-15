import { Media, Wine, WineCharacteristic } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { db } from '@/db/prisma';
import {
    BAD_REQUEST,
    FORBIDDEN,
    RESOURCE_DELETED,
} from '@/utils/constants/api';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
) {
    const wineId = Array.isArray(request.query.wineId)
        ? request.query.wineId[0]
        : request.query.wineId;

    if (!wineId) {
        return response.status(400).json(BAD_REQUEST);
    }

    const session = await unstable_getServerSession(
        request,
        response,
        authOptions
    );

    if (!session) {
        return response.status(403).json(FORBIDDEN);
    }

    const user = await db.user.findUnique({
        where: {
            email: session?.user?.email || undefined,
        },
        select: {
            id: true,
        },
    });

    if (!user) {
        return response.status(403).json(FORBIDDEN);
    }

    if (request.method === 'POST') {
        const wine = await db.wine.findUnique({
            where: {
                id: `${wineId}`,
            },
            select: {
                id: true,
            },
        });

        if (!wine) {
            return response.status(400).json(BAD_REQUEST);
        }

        const result = await updateWine({ wineId, data: request.body });
        return response.status(201).json(result);
    }

    if (request.method === 'DELETE') {
        await deleteWine({ wineId });
        return response.status(201).json(RESOURCE_DELETED);
    }
}

const updateWine = async ({
    wineId,
    data,
}: {
    wineId: Wine['id'];
    data: Omit<Wine, 'userId'> & {
        medias: Media['id'][];
        wineCharacteristics: WineCharacteristic['id'][];
    };
}) => {
    const { medias, wineCharacteristics, ...rest } = data;

    const filteredMedias = medias.filter((media) => media);
    const mediasId = filteredMedias.map((media) => ({ id: media }));

    const wineCharacteristicsId = wineCharacteristics.map(
        (wineCharacteristic) => ({ id: wineCharacteristic })
    );

    await db.wineCharacteristicsOnWines.deleteMany({
        where: {
            wineId,
        },
    });

    await db.media.deleteMany({
        where: {
            AND: {
                NOT: {
                    id: {
                        in: filteredMedias,
                    },
                },
                wineId,
            },
        },
    });

    const updatedWine = await db.wine.update({
        where: {
            id: wineId,
        },
        data: {
            ...rest,
            medias: {
                connect: mediasId,
            },
            wineCharacteristics: {
                create: wineCharacteristicsId.map((wineCharacteristicId) => ({
                    wineCharacteristic: {
                        connect: wineCharacteristicId,
                    },
                })),
            },
        },
    });

    return updatedWine;
};

const deleteWine = async ({ wineId }: { wineId: Wine['id'] }) => {
    await db.wine.delete({
        where: {
            id: `${wineId}`,
        },
    });
};
