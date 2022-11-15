import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';

import { BAD_REQUEST } from '@/utils/constants/api';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
) {
    const fileName = Array.isArray(request.query.fileName)
        ? request.query.fileName[0]
        : request.query.fileName;
    const fileType = Array.isArray(request.query.fileType)
        ? request.query.fileType[0]
        : request.query.fileType;

    if (!fileName || !fileType) {
        return response.status(400).json(BAD_REQUEST);
    }

    const region = process.env.AWS_BUCKET_REGION;
    const bucketName = process.env.AWS_BUCKET_NAME;
    const s3Client = new S3Client({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    const extensionIndex = fileName.indexOf('.');
    const extension = fileName.slice(extensionIndex);

    const key = uuid() + extension;

    const post = await createPresignedPost(s3Client, {
        Bucket: bucketName || '',
        Key: key,
        Fields: {
            'Content-Type': fileType,
        },
        Expires: 600, // seconds
        Conditions: [
            ['content-length-range', 0, 1048576], // up to 1 MB
        ],
    });

    response
        .status(200)
        .json({ ...post, path: key, originalFileName: fileName });
}
