import React, { useState } from 'react';

import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useMutation } from '@tanstack/react-query';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { FieldInput, Loading, LoadingScreen } from '@/components';
import { Head } from '@/layout';
import { ROUTE_ROOT } from '@/utils/constants/routes';

export const PageLogin: React.FC = () => {
    const { status } = useSession();
    const router = useRouter();
    const form = useForm();
    const [isEmailSent, setIsEmailSent] = useState(false);

    const boxBackgroundColor = useBreakpointValue({
        base: 'transparent',
        sm: 'bg-surface',
    });
    const boxBoxShadow = useColorModeValue('md', 'md-dark');

    const { mutate: login, isLoading } = useMutation(
        async (email?: string) => {
            const response = await signIn('email', {
                email,
                redirect: false,
            });

            if (!response?.ok || response?.error) {
                throw new Error(response?.error ?? 'Unknown error');
            }

            setIsEmailSent(true);
        },
        {
            onSuccess: async (_, email) => {
                console.log('success', { _, email });
            },
            onError: (error: Error) => {
                console.log('error', { error });
            },
        }
    );

    if (status === 'authenticated') {
        router.push(ROUTE_ROOT);
        return <LoadingScreen />;
    }

    const handleValidSubmit = (values: any) => {
        login(values.email);
    };

    const shouldDisableSubmitButton =
        (form.isSubmitted && !form.isValid) || isLoading;

    return (
        <>
            <Head />

            <Container
                maxW="lg"
                h="100vh"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                py={{ base: '12', md: '24' }}
                px={{ base: '0', sm: '8' }}
            >
                <Stack spacing="8">
                    <Stack spacing="6" alignItems="center">
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
                    </Stack>

                    <Box
                        py={{ base: '0', sm: '8' }}
                        px={{ base: '4', sm: '10' }}
                        bg={boxBackgroundColor}
                        boxShadow={{
                            base: 'none',
                            sm: boxBoxShadow,
                        }}
                        borderRadius={{ base: 'none', sm: 'xl' }}
                    >
                        {isEmailSent ? (
                            <Flex
                                flexDirection="column"
                                alignItems="items-start"
                                h="full"
                            >
                                <Text fontWeight="bold">
                                    An email has been sucessfully sent 🎉
                                </Text>
                                <Text color="gray-400">
                                    Go to your inbox and click the link to sign
                                    in !
                                </Text>
                                <Button
                                    variant="link"
                                    colorScheme="primary"
                                    w="fit-content"
                                    fontWeight="400"
                                    mt="6"
                                    onClick={() => setIsEmailSent(false)}
                                >
                                    ← Back to sign in
                                </Button>
                            </Flex>
                        ) : (
                            <Formiz
                                connect={form}
                                onValidSubmit={handleValidSubmit}
                                autoForm
                            >
                                <Stack spacing="6">
                                    <Stack spacing="5">
                                        <FieldInput
                                            type="email"
                                            name="email"
                                            label="Email address"
                                            required
                                        />
                                    </Stack>
                                    <Stack spacing="12">
                                        <Button
                                            type="submit"
                                            variant="solid"
                                            colorScheme="primary"
                                            disabled={shouldDisableSubmitButton}
                                        >
                                            {isLoading && (
                                                <Loading
                                                    color="gray.100"
                                                    size="sm"
                                                    mr="2"
                                                />
                                            )}
                                            Sign in
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Formiz>
                        )}
                    </Box>
                </Stack>
            </Container>
        </>
    );
};

export default PageLogin;
