import { Box, BoxProps } from '@chakra-ui/react';

export const Card: React.FC<BoxProps> = (props) => {
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
