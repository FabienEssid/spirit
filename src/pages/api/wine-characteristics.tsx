import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { db } from '@/db/prisma';
import { FORBIDDEN } from '@/utils/constants/api';

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
        const result = await getWineCharacteristics();
        return response.status(200).json(result);
    }
}

export const getWineCharacteristics = async () => {
    const [totalItems, wineCharacteristics] = await db.$transaction([
        db.wineCharacteristic.count(),
        db.wineCharacteristic.findMany(),
    ]);

    return [totalItems, wineCharacteristics];
};
