import React from 'react';

import {
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
import { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { Card, FieldInput, Link, Loading } from '@/components';
import { db } from '@/db/prisma';
import { Layout, LayoutBody, LayoutHeader } from '@/layout';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { ROUTE_SIGN_OUT } from '@/utils/constants/routes';

export const PageMe: React.FC<{ user: User }> = ({ user }) => {
    const form = useForm();

    const subNavigation = [
        { name: 'Account', value: 'account', icon: UserIcon },
        // {
        //     name: 'Sign out',
        //     value: 'sign-out',
        //     icon: ArrowRightOnRectangleIcon,
        // },
    ];

    const { mutate, isLoading } = useMutation(
        async ({ name }: { name: string }): Promise<void> => {
            const result = await axios.post(`/api/user/${user.id}`, { name });
            return result.data;
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
                                    _hover={{ backgroundColor: 'gray.50' }}
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
                        <TabPanel px={{ base: '0', md: '4' }} py="0" pr="0">
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
                                            defaultValue={user.email || ''}
                                            isDisabled
                                            required
                                            maxWidth="container.md"
                                            w="full"
                                        />
                                        <FieldInput
                                            type="text"
                                            name="firstName"
                                            label="First name"
                                            defaultValue={user.name || ''}
                                            required
                                            maxWidth="container.md"
                                            w="full"
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
                                                <Loading size="sm" mr="2" />
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
                                        buttonProps={{ colorScheme: 'primary' }}
                                    >
                                        Sign out
                                    </Link>
                                </Heading>
                            </Card>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </LayoutBody>
        </Layout>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const result = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );
    const { user: userToDisplay } = result || { user: undefined };

    if (!userToDisplay) return { props: { user: undefined } };

    const user = await db.user.findUnique({
        where: {
            email: userToDisplay.email || undefined,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    return { props: { user } };
};

export default PageMe;
