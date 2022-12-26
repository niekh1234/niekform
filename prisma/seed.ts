import { FieldType, Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
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

  const user = await prisma.user.upsert({
    where: { email: 'admin@niekform.io' },
    update: {},
    create: {
      email: 'admin@niekform.io',
      name: faker.name.fullName(),
      password: await hashPassword('admin'),
      role: {
        connect: {
          id: role.id,
        },
      },
    },
  });

  const secondUser = await prisma.user.upsert({
    where: { email: 'other@niekform.io' },
    update: {},
    create: {
      email: 'other@niekform.io',
      name: faker.name.fullName(),
      password: await hashPassword('other'),
      role: {
        connect: {
          id: role.id,
        },
      },
    },
  });

  await seedForUser(user.id);
  await seedForUser(secondUser.id);
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

const seedForUser = async (userId: string) => {
  const existingProject = await prisma.project.findFirst({
    where: {
      name: 'My Project',
      user: {
        id: userId,
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
          id: userId,
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
      submissionCount: 10,
      project: {
        connect: {
          id: project.id,
        },
      },
    },
  });

  const fields = await prisma.field.createMany({
    data: [
      {
        label: 'Name',
        key: 'name',
        type: FieldType.TEXT,
        formId: form.id,
        required: true,
      },
      {
        label: 'Email',
        key: 'email',
        type: FieldType.EMAIL,
        formId: form.id,
        required: true,
      },
      {
        label: 'Message',
        key: 'message',
        type: FieldType.TEXTAREA,
        formId: form.id,
        required: false,
      },
    ],
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
    data: new Array(100).fill(0).map(() => ({
      formId: form.id,
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        message: faker.lorem.paragraph(),
      },
    })),
  });
};

const hashPassword = async (password: string, saltRounds = 10) => {
  const salt = await genSalt(saltRounds);
  return await hash(password, salt);
};
