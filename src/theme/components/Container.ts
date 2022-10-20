import { defineStyleConfig } from '@chakra-ui/react';

export const CustomContainer = defineStyleConfig({
    baseStyle: {
        display: 'flex',
    },
    variants: {
        full: {
            maxHeight: '100vh',
            height: '100vh',
        },
    },
});
