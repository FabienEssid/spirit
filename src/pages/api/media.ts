import { Media, MediaMimeType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/db/prisma';
import { BAD_REQUEST, FORBIDDEN } from '@/utils/constants/api';

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

    const uploadedMedia: Media = await db.media.create({
        data: {
            mimeType: MediaMimeType.IMAGE_PNG,
            path,
            originalFileName,
        },
    });

    return response.status(200).json(uploadedMedia);
}
