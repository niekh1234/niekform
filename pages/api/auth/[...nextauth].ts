import NextAuth, { NextAuthOptions, User } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import prisma from 'lib/prisma';
import { AdapterUser } from 'next-auth/adapters';
import { logger } from 'lib/logger';

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: (process.env.EMAIL_SERVER_PORT as unknown as number) || 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async jwt(req) {
      return req.token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        const users = await prisma.user.findMany();

        // allow the first user to sign in
        if (users.length === 0) {
          return true;
        }

        // allow invited users to sign in
        const _user = user as AdapterUser;

        if (_user?.emailVerified === null) {
          const invite = await getInvite(_user.email);

          if (invite) {
            const user = await upsertUser(_user.email);
            await updateProject(invite.projectId, user.id);
          }

          return !!invite;
        }

        // allow users with verified emails to sign in
        return true;
      } catch (error) {
        logger.error(error);
        return false;
      }
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
};

const getInvite = async (email: string) => {
  return await prisma.invite.findFirst({
    where: {
      email: email,
    },
  });
};

const upsertUser = async (email: string) => {
  return await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      emailVerified: new Date(),
    },
    create: {
      email,
      emailVerified: new Date(),
    },
  });
};

const updateProject = async (projectId: string, userId: string) => {
  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      users: {
        create: [
          {
            user: {
              connect: {
                id: userId,
              },
            },
          },
        ],
      },
    },
  });
};

export default NextAuth(nextAuthOptions);
