import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { badRequest, notFound, ok, unauthorized } from 'lib/server/api';
import { logger } from 'lib/logger';
import { getSession } from 'next-auth/react';

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session?.user) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    if (!id) {
      return badRequest(res);
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        users: {
          some: {
            user: {
              id: session.userId,
            },
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        invites: true,
      },
    });

    if (!project) {
      return notFound(res);
    }

    return ok(res, { project });
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session?.user) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const ownsProject = await prisma.project.findFirst({
      where: {
        id,
        users: {
          some: {
            user: {
              id: session.userId,
            },
          },
        },
      },
    });

    if (!ownsProject) {
      logger.info(
        "Tried to update project that doesn't belong to user, id: " + id,
        'user: ' + session.userId
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
    const session = await getSession({ req });

    if (!session?.user) {
      return unauthorized(res);
    }

    const id = req.query.id as string;

    const ownsProject = await prisma.project.findFirst({
      where: {
        id,
        creator: session.userId,
      },
    });

    if (!ownsProject) {
      logger.info(
        "Tried to delete project that doesn't belong to user, id: " + id,
        'user: ' + session.userId
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
