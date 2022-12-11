import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hashPassword } from 'next-basics';

const prisma = new PrismaClient();

const main = async () => {
  const role = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'admin@niekform.io' },
    update: {},
    create: {
      email: 'admin@niekform.io',
      name: faker.name.fullName(),
      password: hashPassword('admin'),
      role: {
        connect: {
          id: role.id,
        },
      },
    },
  });

  const existingProject = await prisma.project.findFirst({
    where: {
      name: 'My Project',
      user: {
        id: user.id,
      },
    },
  });

  if (existingProject) {
    await prisma.project.delete({
      where: {
        id: existingProject.id,
      },
    });
  }

  const project = await prisma.project.create({
    data: {
      name: 'My Project',
      description: faker.lorem.paragraph(),
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const existingForm = await prisma.form.findFirst({
    where: {
      name: 'First form',
      project: {
        id: project.id,
      },
    },
  });

  if (existingForm) {
    await prisma.form.delete({
      where: {
        id: existingForm.id,
      },
    });
  }

  const form = await prisma.form.create({
    data: {
      name: 'First form',
      project: {
        connect: {
          id: project.id,
        },
      },
    },
  });

  // remove all existing submissions
  await prisma.submission.deleteMany({
    where: {
      form: {
        id: form.id,
      },
    },
  });

  // create new submissions
  await prisma.submission.createMany({
    data: new Array(10).fill(0).map(() => ({
      formId: form.id,
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        message: faker.lorem.paragraph(),
      },
    })),
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
