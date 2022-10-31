import { Flex, FlexProps } from '@chakra-ui/react';

export type CardType = FlexProps;

export const Card: React.FC<CardType> = (props) => {
    return (
        <Flex
            boxShadow="md"
            p="4"
            backgroundColor="white"
            borderRadius="md"
            w="full"
            {...props}
        />
    );
};
