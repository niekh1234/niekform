import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { notFound, ok, unauthorized } from 'lib/server/api';
import { logger } from 'lib/logger';
import { getSession } from 'next-auth/react';

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session?.user) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const form = await prisma.form.findFirst({
      where: {
        id,
        project: {
          userId: session.userId,
        },
      },
      include: {
        fields: true,
      },
    });

    return ok(res, { form });
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session?.user) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const ownsForm = await prisma.form.findFirst({
      where: {
        id,
        project: {
          userId: session.userId,
        },
      },
    });

    if (!ownsForm) {
      logger.info(
        "Tried to update form that doesn't belong to user, id: " + id,
        'user: ' + session.userId
      );
      return notFound(res);
    }

    const form = await prisma.form.update({
      where: {
        id,
      },
      data: {
        name: req.body.name || ownsForm.name,
        notificationSettings: req.body.notificationSettings || ownsForm.notificationSettings,
        settings: req.body.settings || ownsForm.settings,
      },
    });

    return ok(res, form);
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session?.user) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const ownsForm = await prisma.form.findFirst({
      where: {
        id,
        project: {
          userId: session.userId,
        },
      },
    });

    if (!ownsForm) {
      logger.info(
        "Tried to delete form that doesn't belong to user, id: " + id,
        'user: ' + session.userId
      );
      return notFound(res);
    }

    await prisma.form.delete({
      where: {
        id,
      },
    });

    return ok(res);
  });
