import { Media, Wine, WineMedia } from '@prisma/client';
import {
    UseMutationOptions,
    UseQueryOptions,
    useMutation,
    useQuery,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

type WineList = (Wine & { medias: (WineMedia & { media: Media })[] })[];

export const useGetWines = (
    {
        page,
        pageSize,
    }: {
        page: number;
        pageSize: number;
    },
    config?: UseQueryOptions<
        WineList,
        AxiosError,
        { data: [totalItems: number, wines: WineList] },
        any
    >
) => {
    const result = useQuery(
        ['/wines', page, pageSize],
        (): Promise<WineList> =>
            axios.get('/api/wines', {
                params: {
                    page,
                    pageSize,
                },
            }),
        { keepPreviousData: true, ...config }
    );

    const { data } = result.data || { data: [0, undefined] };
    return {
        totalItems: data[0],
        wines: data[1],
        ...result,
    };
};

export const useAddWine = (
    config: UseMutationOptions<
        Wine,
        AxiosError,
        Pick<Wine, 'name' | 'description' | 'rating' | 'isFavorite'>,
        any
    > = {}
) => {
    return useMutation((payload) => axios.post('/api/wines', payload), config);
};

export const useUpdateWine = (
    wineId: string,
    config: UseMutationOptions<
        Wine,
        AxiosError,
        Pick<Wine, 'name' | 'description' | 'rating' | 'isFavorite'>,
        any
    > = {}
) => {
    return useMutation(
        (payload) => axios.post(`/api/wines/${wineId}`, payload),
        config
    );
};
