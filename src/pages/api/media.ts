import { Media } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/db/prisma';
import { BAD_REQUEST, FORBIDDEN } from '@/utils/constants/api';
import { getDatabaseMimeTypeEnumFromMimeType } from '@/utils/functions/media';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
) {
    if (request.method !== 'POST') {
        return response.status(400).json(FORBIDDEN);
    }

    const {
        mimeType,
        path,
        originalFileName,
    }: { mimeType: string; path: string; originalFileName: string } =
        request.body;
    if (!mimeType || !path || !originalFileName) {
        return response.status(400).json(BAD_REQUEST);
    }

    const uploadedMedia = await db.media.create<{
        data: Pick<Media, 'mimeType' | 'path' | 'originalFileName'>;
    }>({
        data: {
            mimeType: getDatabaseMimeTypeEnumFromMimeType(mimeType),
            path,
            originalFileName,
        },
    });

    return response.status(200).json(uploadedMedia);
}
