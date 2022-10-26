import { Media, Wine, WineMedia } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/db/prisma';
import { PAGE_SIZE } from '@/utils/constants/wine';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<
        [
            totalItems: number,
            wines: (Wine & { medias: (WineMedia & { media: Media })[] })[]
        ]
    >
) {
    if (request.method === 'GET') {
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
    }
}
