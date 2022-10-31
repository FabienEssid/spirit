import { Media, Wine, WineMedia } from '@prisma/client';
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
    if (request.method === 'GET') {
        return await getWines(request, response);
    }

    if (request.method === 'POST') {
        return await addWine(request, response);
    }
}

const getWines = async (
    request: NextApiRequest,
    response: NextApiResponse<
        [
            totalItems: number,
            wines: (Wine & { medias: (WineMedia & { media: Media })[] })[]
        ]
    >
) => {
    const {
        pageSize = PAGE_SIZE,
        page = 1,
    }: Partial<{ pageSize: number; page: number }> = request.query;

    const parsedPage = parseInt(`${page}`);
    const parsedPageSize = parseInt(`${pageSize}`);

    const [totalItems, wines] = await db.$transaction([
        db.wine.count(),
        db.wine.findMany({
            skip: (parsedPage - 1) * parsedPageSize,
            take: parsedPageSize,
            include: {
                medias: {
                    include: {
                        media: true,
                    },
                },
            },
        }),
    ]);

    return response.status(200).json([totalItems, wines]);
};

const addWine = async (
    request: NextApiRequest,
    response: NextApiResponse<any>
) => {
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

    const createdWine = await db.wine.create({
        data: {
            ...request.body,
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    return response.status(201).json(createdWine);
};
