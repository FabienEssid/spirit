import {
    Avatar,
    Box,
    ButtonGroup,
    Container,
    Flex,
    HStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

import { Link, Logo } from '@/components';
import {
    ROUTE_ACCOUNT,
    ROUTE_ROOT,
    ROUTE_WINES,
} from '@/utils/constants/routes';

export const LayoutHeader = () => {
    const { data: session } = useSession();

    return (
        <Box
            as="section"
            position="fixed"
            top="0"
            left="0"
            right="0"
            zIndex="banner"
            backgroundColor="white"
        >
            <Box
                as="nav"
                bg="bg-surface"
                boxShadow={useColorModeValue('sm', 'sm-dark')}
            >
                <Container py={{ base: '3', lg: '4' }}>
                    <Flex justify="space-between" w="full">
                        <HStack spacing="4">
                            <ButtonGroup variant="link">
                                <Link
                                    href={ROUTE_ROOT}
                                    buttonProps={{ p: 0, variant: 'link' }}
                                >
                                    <Logo size="8" />
                                </Link>
                            </ButtonGroup>
                            <ButtonGroup variant="solid" colorScheme="primary">
                                <Link href={ROUTE_ROOT}>Home</Link>
                                <Link href={ROUTE_WINES}>Wines list</Link>
                            </ButtonGroup>
                        </HStack>
                        <ButtonGroup variant="link">
                            <Link
                                href={ROUTE_ACCOUNT}
                                buttonProps={{ variant: 'link' }}
                            >
                                <Avatar
                                    boxSize="10"
                                    name={session?.user?.name || 'N C'}
                                />
                            </Link>
                        </ButtonGroup>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};
