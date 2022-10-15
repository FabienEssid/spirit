import { signOut } from 'next-auth/react';
import Image from 'next/image';

export const PageHome = () => {
    return (
        <main className="flex min-h-full h-screen flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
                <div className="relative h-20 w-20">
                    <Image src="/assets/img/logo.png" layout="fill" />
                </div>
                <h2 className="mt-6 text-center text-6xl font-bold tracking-tight text-gray-900">
                    Spirit
                </h2>
            </div>
            <div className="mt-8">
                <button
                    type="button"
                    className="flex justify-center rounded-md border border-transparent bg-primary-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
                    onClick={() => signOut()}
                >
                    Sign out
                </button>
            </div>
        </main>
    );
};

export default PageHome;
