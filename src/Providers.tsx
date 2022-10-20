import { ReactNode } from 'react';

import { ChakraProvider, Container } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { Loading } from '@/components';
import { applicationTheme } from '@/theme';
import {
    SESSION_AUTHENTICATED,
    SESSION_LOADING,
    SESSION_UNAUTHENTICATED,
} from '@/utils/constants/auth';
import {
    ROUTE_ACCOUNT,
    ROUTE_LOGIN,
    ROUTE_ROOT,
} from '@/utils/constants/routes';
import { USER_MANDATORY_FIELDS } from '@/utils/constants/user';
import { isMissingAtLeastOneMandatoryField } from '@/utils/functions/global';

const queryClient = new QueryClient();

const ProviderLoading = () => (
    <Container variant="full">
        <Loading
            containerProps={{ p: '3' }}
            variant="full"
            color="primary.400"
        />
    </Container>
);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === SESSION_UNAUTHENTICATED && router.pathname !== ROUTE_LOGIN) {
        router.push(ROUTE_LOGIN);
        return <ProviderLoading />;
    }

    if (status === SESSION_LOADING) {
        return <ProviderLoading />;
    }

    if (
        status === SESSION_AUTHENTICATED &&
        !router.pathname.startsWith(ROUTE_ROOT)
    ) {
        // FIXME: Improve session?.user. If authenticated and no user, returns an error page
        if (
            session?.user &&
            isMissingAtLeastOneMandatoryField(
                session.user,
                USER_MANDATORY_FIELDS
            )
        ) {
            console.log({ session });
            router.push(ROUTE_ACCOUNT);
        } else {
            router.push(ROUTE_ROOT);
        }
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
