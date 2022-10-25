import { Container, ContainerProps } from '@chakra-ui/react';

export const LayoutBody: React.FC<ContainerProps> = (props) => {
    return (
        <Container
            display="block"
            variant="full"
            width="full"
            mt="20"
            pb="10"
            maxWidth="container.md"
            py={{ base: 'auto', lg: 12 }}
            px={{ base: 'auto', lg: 8 }}
            {...props}
        />
    );
};
