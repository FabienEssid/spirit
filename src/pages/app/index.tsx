import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

import { Layout, LayoutBody, LayoutHeader } from '@/layout';

export const PageHome = () => {
    return (
        <Layout>
            <LayoutHeader />
            <LayoutBody>
                <Flex
                    h="100vh"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    py="12"
                    px={{ base: 6, lg: 8 }}
                >
                    <Flex
                        flexDirection="column"
                        alignItems="center"
                        mx="auto"
                        w="full"
                        maxW={{ base: 'full', sm: 'container.md' }}
                    >
                        <Box position="relative" w="20" h="20">
                            <Image src="/assets/img/logo.png" layout="fill" />
                        </Box>
                        <Stack
                            spacing={{ base: '2', md: '3' }}
                            textAlign="center"
                        >
                            <Heading as="h2" fontSize="6xl" fontWeight="bold">
                                Spirit
                            </Heading>
                        </Stack>
                    </Flex>
                    <Box mt="8">
                        <Button
                            variant="solid"
                            colorScheme="primary"
                            onClick={() => signOut()}
                        >
                            Sign out
                        </Button>
                    </Box>
                </Flex>
            </LayoutBody>
        </Layout>
    );
};

export default PageHome;
