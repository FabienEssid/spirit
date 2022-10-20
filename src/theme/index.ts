import { extendTheme } from '@chakra-ui/react';

import { CustomContainer } from './components/Container';
import { CustomHeading } from './components/Heading';

export const applicationTheme = extendTheme({
    colors: {
        primary: {
            50: '#ffe1ed',
            100: '#ffb1c8',
            200: '#ff7ea0',
            300: '#ff4c75',
            400: '#ff1a46',
            500: '#e6003c',
            600: '#b4003a',
            700: '#810032',
            800: '#500022',
            900: '#21000e',
        },
    },
    config: {
        initialColorMode: 'light',
    },
    components: {
        Container: CustomContainer,
        Heading: CustomHeading,
    },
});
