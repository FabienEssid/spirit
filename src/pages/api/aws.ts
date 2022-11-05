import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<unknown>
) {
    const region = process.env.AWS_BUCKET_REGION;
    const name = process.env.AWS_BUCKET_NAME;
    const s3Client = new S3Client({
        region,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    if (request.method === 'GET') {
        try {
            const data = await s3Client.send(
                new GetObjectCommand({
                    Bucket: name,
                    Key: 'spirit-logo.png',
                })
            );

            return response.status(200).send(data.Body);
        } catch (e) {
            return response.status(400).json(e);
        }
    }

    if (request.method === 'POST') {
        // const upload = new Upload({
        //     client: s3Client,
        //     params: {
        //         Bucket: name,
        //         Key: 'spirit-logo--from-app-4.png',
        //         Body: request.body.get('file'),
        //     },
        // });

        // upload.on('httpUploadProgress', (progress) => {
        //     console.log(progress);
        // });

        // await upload.done();
        return response.status(200).json('ok');
    }
}
