import type { Session } from 'next-auth';
import { AppProps } from 'next/app';

import { Providers } from '@/Providers';

export const App = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
    return (
        <Providers session={session}>
            <Component {...pageProps} />
        </Providers>
    );
};

export default App;
