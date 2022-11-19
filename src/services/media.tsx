import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useDownloadMedia = () =>
    useMutation(async ({ mediaId }: { mediaId: string }) =>
        axios.get(`/api/media/${mediaId}/download`)
    );

export const useUploadMedia = () =>
    useMutation(async ({ media }: { media: Blob }) => {
        const fileName = media?.name;
        const fileType = media?.type;

        const { data } = await axios.get('/api/media/upload', {
            params: { fileName, fileType },
        });
        const { url, fields, path, originalFileName } = data;

        const formData = new FormData();
        Object.entries({ ...fields, file: media }).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        await axios.post(url, formData);
        return await axios.post('/api/media', {
            mimeType: fileType,
            path,
            originalFileName,
        });
    });
