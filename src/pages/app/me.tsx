import React from 'react';

import {
    Alert,
    AlertIcon,
    Button,
    Heading,
    Icon,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    VStack,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { UserIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import {
    Card,
    FieldInput,
    Link,
    Loading,
    LoadingScreen,
    useToastError,
    useToastSuccess,
} from '@/components';
import { Layout, LayoutBody, LayoutHeader } from '@/layout';
import { useGetCurrentUser } from '@/services/user';
import { ROUTE_SIGN_OUT } from '@/utils/constants/routes';

export const PageMe = () => {
    const toastSuccess = useToastSuccess();
    const toastError = useToastError();
    const queryClient = useQueryClient();
    const form = useForm();

    const subNavigation = [
        { name: 'Account', value: 'account', icon: UserIcon },
        // {
        //     name: 'Sign out',
        //     value: 'sign-out',
        //     icon: ArrowRightOnRectangleIcon,
        // },
    ];

    const { data, isFetching: isFetchingUser } = useGetCurrentUser();
    const { user } = data || { user: {} };

    const { mutate, isLoading } = useMutation(
        async ({ name }: { name: string }): Promise<void> => {
            if (!user) return;
            const result = await axios.post(`/api/users/${user.id}`, { name });
            return result.data;
        },
        {
            onSuccess: () => {
                form.reset();
                queryClient.invalidateQueries({ queryKey: ['/current-user'] });
                toastSuccess({
                    title: 'Profile updated',
                    description:
                        'Your profile information have been successfully updated',
                });
            },
            onError: (error) => {
                toastError({
                    title: 'Error',
                    // description: `An error occurred. Please try again later. The error is : ${error?.response?.data || 'unknown'}`, // TODO: FIXME
                });
            },
        }
    );

    const handleValidSubmit = (values: {
        email: string;
        firstName: string;
    }) => {
        mutate({ name: values.firstName });
    };

    const shouldDisableSubmitButton =
        (form.isSubmitted && !form.isValid) || isLoading;

    return (
        <Layout>
            <LayoutHeader />
            <LayoutBody>
                {isFetchingUser && <LoadingScreen />}
                {!isFetchingUser && user && (
                    <>
                        {!user.email ||
                            (!user.name && (
                                <Alert status="info" mb={6} borderRadius="md">
                                    <AlertIcon />
                                    Fill in your information is mandatory to
                                    access to the app
                                </Alert>
                            ))}
                        <Tabs
                            display="flex"
                            flexDirection={{ base: 'column', md: 'row' }}
                            w="full"
                            variant="unstyled"
                            orientation="vertical"
                            isFitted
                        >
                            <TabList
                                display={{ base: 'none', md: 'flex' }}
                                w={{ base: 'full', md: '48' }}
                                minW={{ base: 'full', md: '48' }}
                                height="fit-content"
                            >
                                <VStack spacing="1">
                                    {subNavigation.map((item) => (
                                        <Tab
                                            key={item.name}
                                            _selected={{
                                                backgroundColor: 'gray.50',
                                                color: 'primary.400',
                                                fontWeight: 600,
                                            }}
                                            _hover={{
                                                backgroundColor: 'gray.50',
                                            }}
                                            borderRadius="md"
                                            w="full"
                                            justifyContent="flex-start"
                                        >
                                            <Icon as={item.icon} mr="2" />
                                            {item.name}
                                        </Tab>
                                    ))}
                                </VStack>
                            </TabList>
                            <TabPanels>
                                <TabPanel
                                    pl={{ base: '0', md: '4' }}
                                    py="0"
                                    pr="0"
                                >
                                    <Card
                                        boxShadow={{ base: 'none', md: 'md' }}
                                        h={{ base: 'full', md: 'fit-content' }}
                                    >
                                        <Formiz
                                            autoForm
                                            connect={form}
                                            onValidSubmit={handleValidSubmit}
                                        >
                                            <Heading as="h2" fontSize="lg">
                                                Account
                                            </Heading>
                                            <VStack
                                                alignItems="flex-start"
                                                spacing="6"
                                                mt="4"
                                            >
                                                <FieldInput
                                                    type="email"
                                                    name="email"
                                                    label="Email address"
                                                    defaultValue={
                                                        user.email || ''
                                                    }
                                                    isDisabled
                                                    required
                                                    maxWidth="container.md"
                                                    w="full"
                                                />
                                                <FieldInput
                                                    type="text"
                                                    name="firstName"
                                                    label="First name"
                                                    defaultValue={
                                                        user.name || ''
                                                    }
                                                    required
                                                    maxWidth="container.md"
                                                    w="full"
                                                    autoFocus={
                                                        !form.values.firstName
                                                    }
                                                />
                                                <Button
                                                    type="submit"
                                                    variant="solid"
                                                    colorScheme="primary"
                                                    isDisabled={
                                                        shouldDisableSubmitButton
                                                    }
                                                >
                                                    {isLoading && (
                                                        <Loading
                                                            size="sm"
                                                            mr="2"
                                                        />
                                                    )}
                                                    Save profile
                                                </Button>
                                            </VStack>
                                        </Formiz>
                                    </Card>
                                </TabPanel>
                                <TabPanel py="0" pr="0">
                                    <Card
                                        boxShadow={{ base: 'none', md: 'md' }}
                                        h={{ base: 'full', md: 'fit-content' }}
                                    >
                                        <Heading as="h2" fontSize="lg">
                                            <Link
                                                href={ROUTE_SIGN_OUT}
                                                buttonProps={{
                                                    colorScheme: 'primary',
                                                }}
                                            >
                                                Sign out
                                            </Link>
                                        </Heading>
                                    </Card>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </>
                )}
            </LayoutBody>
        </Layout>
    );
};

export default PageMe;
