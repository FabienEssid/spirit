import React, { useState } from 'react';

import { Formiz, useForm } from '@formiz/core';
import {
    ArrowRightOnRectangleIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { FieldInput, Spinner } from '@/components';
import { db } from '@/db/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export const PageMe: React.FC<{ user: User }> = ({ user }) => {
    const [currentTab, setCurrentTab] = useState('account');
    const form = useForm();

    const subNavigation = [
        { name: 'Account', value: 'account', icon: UserIcon },
        {
            name: 'Sign out',
            value: 'sign-out',
            icon: ArrowRightOnRectangleIcon,
        },
    ];

    const { mutate, isLoading } = useMutation(
        async ({ name }: { name: string }): Promise<void> => {
            const result = await axios.post(`/api/user/${user.id}`, { name });
            return result.data;
        },
        {
            onSuccess(data) {
                console.log({ data });
            },
        }
    );

    const handleValidSubmit = (values: {
        email: string;
        firstName: string;
    }) => {
        console.log('handleValidSubmit', { values });
        mutate({ name: values.firstName });
    };

    const shouldDisableSubmitButton =
        (form.isSubmitted && !form.isValid) || isLoading;

    return (
        <main className="h-screen flex mx-auto max-w-3xl pb-10 lg:py-12 lg:px-8">
            <div className="flex w-full space-x-4">
                <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 grow">
                    <nav className="space-y-1">
                        {subNavigation.map((item) => (
                            <button
                                key={item.name}
                                type="button"
                                className={`w-full ${
                                    currentTab === item.value
                                        ? 'bg-white text-primary-400 hover:bg-gray-50'
                                        : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50 '
                                }
                                    group rounded-md px-3 py-2 flex items-center text-sm font-medium`}
                                aria-current={
                                    currentTab === item.value
                                        ? 'page'
                                        : undefined
                                }
                            >
                                <item.icon
                                    className={`${
                                        currentTab === item.value
                                            ? 'text-primary-400'
                                            : 'text-gray-400 group-hover:text-gray-500 '
                                    }
                                        flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                                    aria-hidden="true"
                                />
                                <span className="truncate">{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="space-y-6 sm:px-6 lg:px-0 px-4 grow-2">
                    <section aria-labelledby="my-account-heading">
                        <Formiz
                            autoForm
                            connect={form}
                            onValidSubmit={handleValidSubmit}
                        >
                            <div className="shadow sm:overflow-hidden sm:rounded-md">
                                <div className="bg-white py-6 px-4 sm:p-6">
                                    <div>
                                        <h2
                                            id="my-account-heading"
                                            className="text-lg font-medium leading-6 "
                                        >
                                            My account
                                        </h2>
                                    </div>

                                    <div className="mt-6">
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Email{' '}
                                                <span className="text-red-600">
                                                    *
                                                </span>
                                            </label>
                                            <FieldInput
                                                required
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="max-w-md"
                                                defaultValue={user.email || ''}
                                                disabled
                                            />

                                            <label
                                                htmlFor="firstName"
                                                className="mt-4 block text-sm font-medium text-gray-700"
                                            >
                                                First name{' '}
                                                <span className="text-red-600">
                                                    *
                                                </span>
                                            </label>
                                            <FieldInput
                                                required
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                className="max-w-md"
                                                defaultValue={user.name || ''}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            className="flex justify-center items-center rounded-md border border-transparent bg-primary-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:bg-primary-200 disabled:cursor-not-allowed"
                                            disabled={shouldDisableSubmitButton}
                                        >
                                            {isLoading && (
                                                <Spinner
                                                    isMonochrome
                                                    size="xs"
                                                />
                                            )}
                                            Save profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Formiz>
                    </section>
                </div>
            </div>
        </main>
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
