import { ok, serverError, unauthorized } from 'lib/server/api';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { latest30DaysOfSubmissions } from 'lib/server/queries/submissions';
import { logger } from 'lib/logger';
import { getSession } from 'next-auth/react';

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return unauthorized(res);
  }

  try {
    let latestForms = await prisma.form.findMany({
      where: {
        project: {
          users: {
            some: {
              user: {
                id: session.userId,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      include: {
        project: true,
      },
    });

    const submissionsByDay = await latest30DaysOfSubmissions(session.userId);

    return ok(res, {
      latestForms,
      submissionsByDay,
    });
  } catch (err) {
    logger.error(err);
    return serverError(res, 'Internal server error');
  }
});
