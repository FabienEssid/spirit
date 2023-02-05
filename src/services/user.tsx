import { User } from '@prisma/client';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useGetCurrentUser = (
    config?: UseQueryOptions<User, AxiosError, { data: User }, any>
) => {
    const result = useQuery(
        ['/current-user'],
        (): Promise<User> => axios.get('/api/current-user'),
        { keepPreviousData: true, ...config }
    );

    const { data } = result.data || { data: undefined };

    return {
        ...result,
        data: {
            user: data,
        },
    };
};
