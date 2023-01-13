import { PrismaClient } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
  const role = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
    },
  });

  const email = process.env.CREDENTIALS_EMAIL;
  const password = process.env.CREDENTIALS_PASSWORD;
  const name = process.env.CREDENTIALS_USERNAME;

  if (!email || !password || !name) {
    console.error('Missing credentials');
    process.exit(1);
  }

  const hashed = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password: hashed,
      role: {
        connect: {
          id: role.id,
        },
      },
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const hashPassword = async (password: string, saltRounds = 10) => {
  const salt = await genSalt(saltRounds);
  return await hash(password, salt);
};
