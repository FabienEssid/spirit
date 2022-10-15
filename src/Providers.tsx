import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import {
    SESSION_AUTHENTICATED,
    SESSION_LOADING,
    SESSION_UNAUTHENTICATED,
} from './utils/constants/auth';
import { ROUTE_LOGIN, ROUTE_ROOT } from './utils/constants/routes';

const queryClient = new QueryClient();

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { status } = useSession();
    const router = useRouter();

    if (status === SESSION_UNAUTHENTICATED && router.pathname !== ROUTE_LOGIN) {
        router.push(ROUTE_LOGIN);
        return <div>Loading...</div>;
    }

    if (status === SESSION_LOADING) {
        return <div>Loading...</div>;
    }

    if (
        status === SESSION_AUTHENTICATED &&
        !router.pathname.startsWith(ROUTE_ROOT)
    ) {
        router.push(ROUTE_ROOT);
    }

    return <>{children}</>;
};

export const Providers = ({ session, children }: any) => {
    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
};
