import { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/db/prisma';
import { BAD_REQUEST, FORBIDDEN } from '@/utils/constants/api';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (!request.body || !request.query.userId) {
        return response.status(400).json(BAD_REQUEST);
    }

    if (!process.env.SESSION_TOKEN_NAME) {
        return response.status(403).json(FORBIDDEN);
    }

    const session = await db.session.findUnique({
        where: {
            sessionToken: request.cookies[process.env.SESSION_TOKEN_NAME],
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
