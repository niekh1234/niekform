import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { cleanSubmission, validateSubmission } from 'lib/server/form/submission';
import { NotificationFactory } from 'lib/server/providers/notifications/factory';
import { Submission } from 'lib/types';
import { logger } from 'lib/logger';

// this will be refactored later
export default nextConnect().post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.query.id || !req.body) {
      return res.redirect(301, '/p/error?message=Form not found&referer=' + req.headers.referer);
    }

    // honeypot
    if (!req.body || req.body.a_password) {
      logger.info('Honeypot triggered, user ip: ' + req.headers['x-forwarded-for']);
      return res.redirect(301, '/p/thank-you?referer=' + req.headers.referer);
    }

    const form = await prisma.form.findFirst({
      where: { id: req.query.id as string },
      include: { fields: true },
    });

    if (!form) {
      logger.info(
        'User tried to submit to a form that does not exist, user ip: ' +
          req.headers['x-forwarded-for']
      );
      return res.redirect(301, '/p/error?message=Form not found&referer=' + req.headers.referer);
    }

    const { errors, valid } = validateSubmission(form.fields, req.body);

    if (!valid) {
      return res.redirect(
        301,
        '/p/error?message=' + Object.values(errors).join(', ') + '&referer=' + req.headers.referer
      );
    }

    const cleaned = cleanSubmission(form.fields, req.body);

    const [submission] = await prisma.$transaction([
      prisma.submission.create({
        data: {
          formId: form.id,
          rawdata: cleaned,
        },
      }),
      prisma.form.update({
        where: { id: form.id },
        data: {
          submissionCount: {
            increment: 1,
          },
        },
      }),
    ]);

    sendNotification(submission);

    return res.redirect(301, '/p/thank-you?referer=' + req.headers.referer);
  } catch (err) {
    logger.error(err);
    return res.redirect(
      301,
      '/p/error?message=Something went wrong&referer=' + req.headers.referer
    );
  }
});

const sendNotification = async (submission: Submission) => {
  const notificationFactory = new NotificationFactory();
  await notificationFactory.sendNotifications(submission);
};
