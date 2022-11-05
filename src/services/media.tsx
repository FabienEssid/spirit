import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUploadImage = () => {
    const result = useMutation(
        async (file: Blob) =>
            await axios.post(
                '/api/media/upload',
                { file: file },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
    );

    return result;
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
