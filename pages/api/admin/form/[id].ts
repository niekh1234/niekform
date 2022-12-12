import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { unauthorized, ok, notFound } from 'next-basics';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const projects = await prisma.form.findMany({
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

    return ok(res, projects);
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const ownsProject = await prisma.form.findFirst({
      where: {
        id,
        project: {
          userId: session.userId,
        },
      },
    });

    if (!ownsProject) {
      return notFound(res);
    }

    const form = await prisma.form.update({
      where: {
        id,
      },
      data: {
        name: req.body.name,
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

    const ownsProject = await prisma.form.findFirst({
      where: {
        id,
        project: {
          userId: session.userId,
        },
      },
    });

    if (!ownsProject) {
      return notFound(res);
    }

    await prisma.form.delete({
      where: {
        id,
      },
    });

    return ok(res);
  });
