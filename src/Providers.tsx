import { ReactNode } from 'react';

import { ChakraProvider, Container } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { Loading, LoadingScreen } from '@/components';
import { applicationTheme } from '@/theme';
import {
    SESSION_AUTHENTICATED,
    SESSION_LOADING,
    SESSION_UNAUTHENTICATED,
} from '@/utils/constants/auth';
import { ROUTE_ACCOUNT, ROUTE_LOGIN } from '@/utils/constants/routes';
import { USER_MANDATORY_FIELDS } from '@/utils/constants/user';
import { isMissingAtLeastOneMandatoryField } from '@/utils/functions/global';

const queryClient = new QueryClient();

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (
        status === SESSION_AUTHENTICATED &&
        session?.user &&
        isMissingAtLeastOneMandatoryField(
            session.user,
            USER_MANDATORY_FIELDS
        ) &&
        router.pathname !== ROUTE_ACCOUNT
    ) {
        router.push(ROUTE_ACCOUNT);
        return <LoadingScreen />;
    }

    if (status === SESSION_UNAUTHENTICATED && router.pathname !== ROUTE_LOGIN) {
        router.push(ROUTE_LOGIN);
        return <LoadingScreen />;
    }

    if (status === SESSION_LOADING) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
};

export const Providers = ({ session, children }: any) => {
    return (
        <SessionProvider session={session}>
            <ChakraProvider theme={applicationTheme}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>{children}</AuthProvider>
                </QueryClientProvider>
            </ChakraProvider>
        </SessionProvider>
    );
};
