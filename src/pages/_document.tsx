import { ColorModeScript, theme } from '@chakra-ui/react';
import { Head, Html, Main, NextScript } from 'next/document';

export const Document = () => {
    return (
        <Html>
            <Head />
            <body>
                <ColorModeScript
                    initialColorMode={theme.config.initialColorMode}
                />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Document;
