import NextHead from 'next/head';

export const Head = () => {
    return (
        <NextHead>
            <title>Spirit</title>
            <link rel="manifest" href="/manifest.json" />
            <meta name="application-name" content="Spirit" />
            <meta name="apple-mobile-web-app-title" content="Spirit" />
            <meta
                name="description"
                content="Take notes and photo for your spirits and wines"
            />
            <meta name="theme-color" content="#FF2C55" />
            <link
                rel="icon"
                type="image/png"
                sizes="48x48"
                href="/icons/favicon-48x48.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="72x72"
                href="/icons/favicon-72x72.png"
            />
            <link rel="icon" href="/favicon.ico" />
            <link rel="shortcut icon" href="/favicon.ico" />
        </NextHead>
    );
};

export default Head;
