import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getUploadMediaURL = ({
    fileName,
    fileType,
}: {
    fileName: string;
    fileType: string;
}) => axios.get('/api/media/upload', { params: { fileName, fileType } });

export const uploadMedia = async ({
    url,
    payload,
    mimeType,
    path,
    originalFileName,
}: {
    url: string;
    payload: FormData;
    mimeType: string;
    path: string;
    originalFileName?: string;
}) => {
    try {
        await axios.post(url, payload);
        return await axios.post('/api/media', {
            mimeType,
            path,
            originalFileName,
        });
    } catch (e) {
        return null;
    }
};

export const useDownloadImage = ({ mediaId }: { mediaId: string }) => {
    const result = useQuery(
        ['/aws/download'],
        (): Promise<any> =>
            axios.get(`/api/media/${mediaId}/download`, {
                responseType: 'blob',
            })
    );

    const blob =
        result.data && result.data.data
            ? new Blob([result.data.data], { type: 'image/png' })
            : null;
    const image = blob ? URL.createObjectURL(blob) : null;

    return {
        ...result,
        data: image,
    };
};
