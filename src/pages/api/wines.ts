import { Media, Wine, WineCharacteristic } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { db } from '@/db/prisma';
import { FORBIDDEN } from '@/utils/constants/api';
import { PAGE_SIZE } from '@/utils/constants/wine';

import { authOptions } from './auth/[...nextauth]';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
) {
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

    if (request.method === 'GET') {
        const { pageSize, page }: Partial<{ pageSize: number; page: number }> =
            request.query;
        const result = await getWines({
            pageSize,
            page,
            userId: user.id,
        });
        return response.status(200).json(result);
    }

    if (request.method === 'POST') {
        const createdWine = await addWine({
            data: request.body,
            userId: user.id,
        });
        response.status(201).json(createdWine);
    }
}

const getWines = async ({
    pageSize = PAGE_SIZE,
    page = 1,
    userId,
}: {
    pageSize?: number;
    page?: number;
    userId: string;
}) => {
    const parsedPage = parseInt(`${page}`);
    const parsedPageSize = parseInt(`${pageSize}`);

    const [totalItems, wines] = await db.$transaction([
        db.wine.count({
            where: {
                userId: userId,
            },
        }),
        db.wine.findMany({
            skip: (parsedPage - 1) * parsedPageSize,
            take: parsedPageSize,
            include: {
                medias: true,
            },
            where: {
                userId: userId,
            },
        }),
    ]);

    return [totalItems, wines];
};

const addWine = async ({
    data,
    userId,
}: {
    data: Omit<Wine, 'userId'> & {
        medias: Media['id'][];
        wineCharacteristics: WineCharacteristic['id'][];
    };
    userId: string;
}) => {
    const { medias, wineCharacteristics, ...rest } = data;

    const mediasId = medias
        .filter((media) => media)
        .map((media) => ({ id: media }));

    const wineCharacteristicsId = wineCharacteristics.map(
        (wineCharacteristic) => ({ id: wineCharacteristic })
    );

    const createdWine = await db.wine.create({
        data: {
            ...rest,
            user: {
                connect: {
                    id: userId,
                },
            },
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

    return createdWine;
};
