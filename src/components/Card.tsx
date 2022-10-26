import { Box, BoxProps } from '@chakra-ui/react';

export type CardType = BoxProps;

export const Card: React.FC<CardType> = (props) => {
    return (
        <Box
            boxShadow="md"
            p="4"
            backgroundColor="white"
            borderRadius="md"
            w="full"
            {...props}
        />
    );
};
