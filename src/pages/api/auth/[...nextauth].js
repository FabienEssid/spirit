import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '@/db/prisma';

export default NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    // https://next-auth.js.org/configuration/providers/oauth
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email address', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const user = db.user.findUnique({
          where: { email, password },
        });
      },
    }),
  ],
});
