import { signOut } from 'next-auth/react';

export const PageHome = () => {
    return (
        <div>
            <div>Home</div>
            <button
                type="button"
                className="flex justify-center rounded-md border border-transparent bg-[#FF2C55] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#FF2C55] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => signOut()}
            >
                Sign out
            </button>
        </div>
    );
};

export default PageHome;
