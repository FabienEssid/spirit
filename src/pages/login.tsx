import React, { useState } from 'react';

import { Formiz, useForm } from '@formiz/core';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

import { Spinner } from '@/components';
import { FieldInput } from '@/components/FieldInput';
import { Head } from '@/layout';

export const PageLogin: React.FC = () => {
    const form = useForm();
    const [isEmailSent, setIsEmailSent] = useState(false);

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

    const handleValidSubmit = (values: any) => {
        console.log({ values });
        login(values.email);
    };

    const shouldDisableSubmitButton =
        (form.isSubmitted && !form.isValid) || isLoading;

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
                <section className="mt-8 sm:mx-auto w-full sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 sm:shadow sm:rounded-lg sm:px-10">
                        {isEmailSent ? (
                            <div className="flex flex-col items-start h-full">
                                <p>An email has been sucessfully sent 🎉</p>
                                <p className="text-gray-400">
                                    Go to your inbox and click the link to sign
                                    in !
                                </p>
                                <button
                                    type="button"
                                    className="mt-8 hover:underline text-primary-400 flex-1"
                                    onClick={() => setIsEmailSent(false)}
                                >
                                    ← Back to sign in
                                </button>
                            </div>
                        ) : (
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
                                                defaultValue="fabien.essid@gmail.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center items-center rounded-md border border-transparent bg-primary-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:bg-primary-200 disabled:cursor-not-allowed"
                                            disabled={shouldDisableSubmitButton}
                                        >
                                            {isLoading && (
                                                <Spinner
                                                    isMonochrome
                                                    size="xs"
                                                />
                                            )}
                                            Sign in
                                        </button>
                                    </div>
                                </form>
                            </Formiz>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default PageLogin;
