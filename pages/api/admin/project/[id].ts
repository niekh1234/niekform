import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { badRequest, notFound, ok, unauthorized } from 'lib/server/api';
import { logger } from 'lib/logger';

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    if (!id) {
      return badRequest(res);
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: session.id,
      },
    });

    if (!project) {
      return notFound(res);
    }

    return ok(res, { project });
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const ownsProject = await prisma.project.findFirst({
      where: {
        id,
        userId: session.id,
      },
    });

    if (!ownsProject) {
      logger.info(
        "Tried to update project that doesn't belong to user, id: " + id,
        'user: ' + session.id
      );
      return notFound(res);
    }

    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name: req.body.name,
        description: req.body.description,
      },
    });

    return ok(res, { project });
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const ownsProject = await prisma.project.findFirst({
      where: {
        id,
        userId: session.id,
      },
    });

    if (!ownsProject) {
      logger.info(
        "Tried to delete project that doesn't belong to user, id: " + id,
        'user: ' + session.id
      );
      return notFound(res);
    }

    const project = await prisma.project.delete({
      where: {
        id,
      },
    });

    return ok(res, { success: !!project });
  });
