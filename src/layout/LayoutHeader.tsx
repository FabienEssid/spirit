import {
    Avatar,
    Box,
    ButtonGroup,
    Container,
    Flex,
    HStack,
    Icon,
    IconButton,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';
import { Bars3Icon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Link } from '@/components';
import { ROUTE_ACCOUNT, ROUTE_ROOT } from '@/utils/constants/routes';

export const LayoutHeader = () => {
    const router = useRouter();
    const isDesktop = useBreakpointValue({ base: false, lg: true });

    return (
        <Box as="section" position="fixed" top="0" left="0" right="0">
            <Box
                as="nav"
                bg="bg-surface"
                boxShadow={useColorModeValue('sm', 'sm-dark')}
            >
                <Container py={{ base: '3', lg: '4' }}>
                    <Flex justify="space-between" w="full">
                        <HStack spacing="4">
                            <ButtonGroup variant="link">
                                <Link href={ROUTE_ROOT} buttonProps={{ p: 0 }}>
                                    <Box position="relative" w="8" h="8">
                                        <Image
                                            src="/assets/img/logo.png"
                                            layout="fill"
                                        />
                                    </Box>
                                </Link>
                            </ButtonGroup>
                        </HStack>
                        <ButtonGroup variant="link">
                            <Link
                                href={ROUTE_ACCOUNT}
                                buttonProps={{ variant: 'link' }}
                            >
                                <Avatar
                                    boxSize="10"
                                    name="Fabien Essid"
                                    src="https://avatars.githubusercontent.com/u/50022361?v=4"
                                />
                            </Link>
                        </ButtonGroup>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};
