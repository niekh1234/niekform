import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { notFound, ok, unauthorized } from 'lib/server/api';

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const form = await prisma.form.findFirst({
      where: {
        id,
        project: {
          userId: session.id,
        },
      },
      include: {
        fields: true,
      },
    });

    return ok(res, { form });
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const ownedForm = await prisma.form.findFirst({
      where: {
        id,
        project: {
          userId: session.id,
        },
      },
    });

    if (!ownedForm) {
      return notFound(res);
    }

    const form = await prisma.form.update({
      where: {
        id,
      },
      data: {
        name: req.body.name || ownedForm.name,
        notificationSettings: req.body.notificationSettings || ownedForm.notificationSettings,
      },
    });

    return ok(res, form);
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const ownsForm = await prisma.form.findFirst({
      where: {
        id,
        project: {
          userId: session.id,
        },
      },
    });

    if (!ownsForm) {
      return notFound(res);
    }

    await prisma.form.delete({
      where: {
        id,
      },
    });

    return ok(res);
  });
