import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import multiparty, { Part } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';

import { db } from '@/db/prisma';
import { FORBIDDEN } from '@/utils/constants/api';
import { getDatabaseMimeTypeEnumFromMimeType } from '@/utils/functions/media';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
) {
    if (request.method !== 'POST') {
        return response.status(400).json(FORBIDDEN);
    }

    try {
        const { key, mimeType, originalFileName } = await new Promise<{
            key: string;
            mimeType: string;
            originalFileName: string;
        }>((resolve, reject) => {
            const region = process.env.AWS_BUCKET_REGION;
            const bucketName = process.env.AWS_BUCKET_NAME;
            const s3Client = new S3Client({
                region,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
                },
            });

            const form = new multiparty.Form();
            form.on('part', async function (part: Part) {
                const extensionIndex = part.filename.indexOf('.');
                const extension = part.filename.slice(extensionIndex);

                const key = uuid() + extension;
                const mimeType = part.headers['content-type'];
                const originalFileName = part.filename;

                let upload = new Upload({
                    client: s3Client,
                    params: {
                        Bucket: bucketName,
                        Key: key,
                        Body: part,
                        // ContentLength: part.byteCount, It appears that leaving this option creates issues when files separated in multi parts are sent : https://github.com/aws/aws-sdk-js-v3/issues/3915
                    },
                });

                try {
                    await upload.done();
                    resolve({ key, mimeType, originalFileName });
                } catch (error) {
                    reject(error);
                }
            });

            form.parse(request);
        });

        const uploadedMedia = await db.media.create({
            data: {
                mimeType: getDatabaseMimeTypeEnumFromMimeType(mimeType),
                path: key,
                originalFileName,
            },
        });

        return response.status(200).json(uploadedMedia);
    } catch (e) {
        return response.status(400).send(e);
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
