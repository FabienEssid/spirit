import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
) {
    const { key } = request.body;
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
        const url = await getSignedUrl(
            s3Client,
            new PutObjectCommand({ Bucket: bucketName, Key: `${key}` })
        );

        return response.status(200).json({ url });
    } catch (e) {
        return response.status(400).json(e);
    }
}
