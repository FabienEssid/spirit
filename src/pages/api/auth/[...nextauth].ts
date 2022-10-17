import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import { db } from '@/db/prisma';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
    ],
    pages: {
        signIn: '/login',
    },
    // callbacks: {
    //     authorized({ req, token }) {
    //         console.log({ req, token });

    //         return !!token;
    //     },
    // },
};

export default NextAuth(authOptions);