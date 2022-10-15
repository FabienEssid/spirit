import { Providers } from '@/Providers';

import '../../styles/global.css';

export const App = ({
    Component,
    pageProps: { session, ...pageProps },
}: any) => {
    return (
        <Providers session={session}>
            <Component {...pageProps} />
        </Providers>
    );
};

export default App;
