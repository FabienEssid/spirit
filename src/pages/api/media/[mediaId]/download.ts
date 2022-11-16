import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/db/prisma';
import { BAD_REQUEST, FORBIDDEN } from '@/utils/constants/api';
import { getMimeTypeFromDatabaseMimeTypeEnum } from '@/utils/functions/media';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
) {
    if (request.method !== 'GET' || !request.query.mediaId) {
        return response.status(400).json(BAD_REQUEST);
    }

    if (
        !process.env.AWS_BUCKET_NAME ||
        !process.env.AWS_BUCKET_REGION ||
        !process.env.AWS_ACCESS_KEY_ID ||
        !process.env.AWS_SECRET_ACCESS_KEY
    ) {
        return response.status(403).json(FORBIDDEN);
    }

    const mediaId = Array.isArray(request.query.mediaId)
        ? request.query.mediaId[0]
        : request.query.mediaId;

    const media = await db.media.findUnique({
        where: {
            id: mediaId,
        },
    });

    if (!media) {
        return response.status(400).json(FORBIDDEN);
    }

    const key = media.path;
    const mimeType = getMimeTypeFromDatabaseMimeTypeEnum(media.mimeType);
    const region = process.env.AWS_BUCKET_REGION;
    const bucketName = process.env.AWS_BUCKET_NAME;
    const s3Client = new S3Client({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    try {
        const { Body: data } = await s3Client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
                ResponseContentType: mimeType,
            })
        );

        return response.status(200).send(data);
    } catch (e) {
        console.error('error', e);
        return response.status(400).json(e);
    }
}
