import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { db } from '@/db/prisma';
import { FORBIDDEN } from '@/utils/constants/api';

import { authOptions } from './auth/[...nextauth]';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
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
    });

    if (!user) {
        return response.status(403).json(FORBIDDEN);
    }

    return response.status(200).json(user);
}
