import { badRequest, notFound, ok, unauthorized } from 'lib/server/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { logger } from 'lib/logger';
import { InviteProvider } from 'lib/server/services/invite';

export default nextConnect().post(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return unauthorized(res);
  }

  const { email } = req.body;

  if (!email) {
    return badRequest(res);
  }

  const id = req.query.id as string;

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
  });

  if (!project) {
    return notFound(res);
  }

  try {
    await prisma.invite.create({
      data: {
        email,
        status: 'PENDING',
        project: {
          connect: {
            id,
          },
        },
      },
    });

    const inviter = new InviteProvider(email, project);

    await inviter.send();
  } catch (err) {
    logger.error(err);
    return badRequest(res);
  }

  return ok(res, { email });
});
