import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import prisma from 'lib/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
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
  callbacks: {
    async signIn({ user }) {
      // only allow one account
      const users = await prisma.user.findMany();

      if (users.length > 0 && users[0].id !== user.id) {
        return false;
      }

      return true;
    },
    async session({ session, user }) {
      session.userId = user.id;

      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/signin?verifyRequest=true',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
