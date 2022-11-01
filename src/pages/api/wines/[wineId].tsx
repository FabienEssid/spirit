import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { db } from '@/db/prisma';
import { BAD_REQUEST, FORBIDDEN } from '@/utils/constants/api';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
) {
    if (request.method === 'POST') {
        return await updateWine(request, response);
    }
}

const updateWine = async (
    request: NextApiRequest,
    response: NextApiResponse<any>
) => {
    const { wineId } = request.query;

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

    const updatedWine = await db.wine.update({
        where: {
            id: wine.id,
        },
        data: {
            ...request.body,
        },
    });

    return response.status(201).json(updatedWine);
};
