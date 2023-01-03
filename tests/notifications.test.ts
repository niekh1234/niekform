import { faker } from '@faker-js/faker';
import { NotificationFactory } from '../lib/server/providers/notifications/factory';
import { Submission } from '../lib/types';
import prisma from '../lib/prisma';

test('email notification message', async () => {
  const firstForm = await prisma.form.findFirst();

  if (!firstForm) {
    throw new Error('No forms found');
  }

  const submission = {
    id: faker.random.alphaNumeric(10),
    formId: firstForm.id,
    data: {
      name: faker.name.firstName(),
    },
    createdAt: new Date(),
  } as Submission;

  const notificationFactory = new NotificationFactory();

  notificationFactory.sendNotifications(submission);
});
