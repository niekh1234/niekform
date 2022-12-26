import { User } from '@prisma/client';
import { genSalt, hash, compare } from 'bcrypt';
import { Session } from 'lib/types';
import prisma from '../../prisma';

const SALT_ROUNDS = 10;

export const createUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  const nUsers = await prisma.user.count();

  if (nUsers > 1) {
    throw new Error('There is already a registered user. Did you mean to log in?');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = {
    email,
    password: hashedPassword,
    name,
    role: {
      connect: {
        name: 'ADMIN',
      },
    },
  };

  return await prisma.user.create({ data: newUser });
};

export const findUser = async ({ id }: Session) => {
  return await prisma.user.findFirst({ where: { id } });
};

export const findUserByEmail = (email: string) => {
  return prisma.user.findFirst({ where: { email } });
};

export const validatePassword = async (user: User, inputPassword: string) => {
  return await compare(inputPassword, user.password);
};

export const hashPassword = async (password: string, saltRounds = SALT_ROUNDS) => {
  const salt = await genSalt(saltRounds);
  return await hash(password, salt);
};
