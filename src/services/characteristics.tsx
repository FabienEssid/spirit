import { WineCharacteristic } from '@prisma/client';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

type WineCharacteristicList = WineCharacteristic[];

export const useGetWineCharacteristics = (
    config?: UseQueryOptions<
        WineCharacteristicList,
        AxiosError,
        {
            data: [
                totalItems: number,
                wineCharacteristics: WineCharacteristicList
            ];
        },
        any
    >
) => {
    const result = useQuery(
        ['/wine-characteristics'],
        (): Promise<any> => axios.get('/api/wine-characteristics'),
        { keepPreviousData: true, ...config }
    );

    const { data } = result.data || { data: [0, undefined] };
    return {
        totalItems: data[0],
        wineCharacteristics: data[1],
        ...result,
    };
};
