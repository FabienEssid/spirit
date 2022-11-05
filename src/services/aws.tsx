import { UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useAWSBucket = (
    config?: UseQueryOptions<
        any,
        AxiosError,
        { data: [totalItems: number, wines: any] },
        any
    >
) => {
    const result = useQuery(
        ['/aws'],
        (): Promise<any> => axios.get('/api/aws'),
        { keepPreviousData: true, ...config }
    );

    return result;
};

export const useUploadImage = () => {
    const result = useMutation(async (file: any) => {
        const url = await axios.post('/api/aws/upload', {
            key: file.name,
        });

        await axios.put(url.data.url, file, {
            headers: {
                'Content-Type': file.type,
                'Access-Control-Allow-Origin': '*',
            },
        });

        return true;
        // const region = 'xxx';
        // const name = 'xxx';
        // const s3Client = new S3Client({
        //     region,
        //     credentials: {
        //         // accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        //         // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        //         accessKeyId: 'xxx',
        //         secretAccessKey: 'xxx',
        //     },
        // });

        // const { data } = await axios.get('/api/aws');
        // console.log({ data });

        // const upload = new Upload({
        //     client: s3Client,
        //     params: {
        //         Bucket: name,
        //         Key: 'spirit-logo--from-app-5.png',
        //         Body: file,
        //     },
        // });

        // upload.on('httpUploadProgress', (progress) => {
        //     console.log(progress);
        // });

        // await upload.done();
        // return true;
    });

    return result;
};

export const useDownloadImage = () => {
    const result = useQuery(
        ['/aws/download'],
        (): Promise<any> =>
            axios.get('/api/aws/download', {
                responseType: 'blob',
            })
    );

    const blob =
        result.data && result.data.data
            ? new Blob([result.data.data], { type: 'image/png' })
            : null;
    const image = blob ? URL.createObjectURL(blob) : null;

    return { ...result, data: image };
};
