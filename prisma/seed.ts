import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const email = process.env.CREDENTIALS_EMAIL;
  const name = process.env.CREDENTIALS_USERNAME;

  if (!email || !name) {
    console.error('Missing credentials');
    process.exit(1);
  }

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
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
