import { PrismaClient } from '@prisma/client';

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

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password,
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
