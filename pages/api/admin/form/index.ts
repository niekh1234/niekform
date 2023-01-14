import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { badRequest, ok, unauthorized } from 'lib/server/api';
import { logger } from 'lib/logger';
import { getSession } from 'next-auth/react';

export default nextConnect().post(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return unauthorized(res);
  }

  if (!req.body.name || !req.body.projectId) {
    return badRequest(res, 'Missing required fields.');
  }

  const ownsProject = await prisma.project.findFirst({
    where: {
      id: req.body.projectId,
      userId: session.userId,
    },
  });

  if (!ownsProject) {
    logger.info("Tried to create form for project that doesn't belong to user.", {
      projectId: req.body.projectId,
      userId: session.userId,
    });
    return badRequest(res, 'Project does not exist or does not belong to user.');
  }

  const form = await prisma.form.create({
    data: {
      name: req.body.name as string,
      projectId: req.body.projectId,
      notificationSettings: {
        email: session.user.email,
      },
    },
  });

  if (!form) {
    return badRequest(res, 'Form could not be created.');
  }

  return ok(res, { form });
});
