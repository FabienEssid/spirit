import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
) {
    const key = 'spirit-logo.png';
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
        const result = await s3Client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
                ResponseContentType: 'image/png',
            })
        );

        return response.status(200).send(result.Body);
    } catch (e) {
        console.error('error', e);
        return response.status(400).json(e);
    }
}
