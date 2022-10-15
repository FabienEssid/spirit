import React from 'react';

import { Formiz, useForm } from '@formiz/core';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

import { FieldInput } from '@/components/FieldInput';
import { Head } from '@/layout';

export const PageLogin = () => {
    const form = useForm();

    const { mutate: login, isLoading } = useMutation(
        async (email?: string) => {
            const response = await signIn('email', {
                email,
                redirect: false,
            });

            if (!response?.ok || response?.error) {
                throw new Error(response?.error ?? 'Unknown error');
            }

            return response;
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

    const handleValidSubmit = (values: any) => {
        login(values.email);
    };

    return (
        <>
            <Head />

            <main className="flex min-h-full h-screen flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="relative h-20 w-20">
                        <Image src="/assets/img/logo.png" layout="fill" />
                    </div>
                    <h2 className="mt-6 text-center text-6xl font-bold tracking-tight text-gray-900">
                        Spirit
                    </h2>
                </div>
                <section className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <Formiz
                            connect={form}
                            onValidSubmit={handleValidSubmit}
                        >
                            <form
                                noValidate
                                onSubmit={form.submit}
                                className="space-y-6"
                            >
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <FieldInput
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md border border-transparent bg-[#FF2C55] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#FF2C55] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </Formiz>
                    </div>
                </section>
            </main>
        </>
    );
};

export default PageLogin;
