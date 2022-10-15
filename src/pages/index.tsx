import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { ROUTE_ROOT } from '@/utils/constants/routes';

export const RootPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace(ROUTE_ROOT);
    }, [router]);

    return '';
};

export default RootPage;
