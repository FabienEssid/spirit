import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { db } from '@/db/prisma';
import { BAD_REQUEST, FORBIDDEN } from '@/utils/constants/api';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (!request.body || !request.query.userId) {
        return response.status(400).json(BAD_REQUEST);
    }

    const session = await db.session.findUnique({
        where: {
            sessionToken: request.cookies['next-auth.session-token'],
        },
        include: {
            user: true,
        },
    });

    if (request.query.userId !== session?.user.id) {
        return response.status(403).json(FORBIDDEN);
    }

    const userUpdated = await db.user.update({
        where: {
            id: request.query.userId,
        },
        data: {
            ...request.body,
        },
    });

    return response.status(200).json(userUpdated);
}
