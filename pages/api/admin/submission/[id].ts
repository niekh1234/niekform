import { logger } from 'lib/logger';
import { notFound, ok, serverError, unauthorized } from 'lib/server/api';
import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';

export default nextConnect().delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  try {
    const id = req.query.id as string;

    const submission = await prisma.submission.findFirst({
      where: {
        id,
        form: {
          project: {
            userId: session.id,
          },
        },
      },
    });

    if (!submission) {
      return notFound(res);
    }

    await prisma.submission.delete({
      where: {
        id,
      },
    });

    await prisma.form.update({
      where: {
        id: submission.formId,
      },
      data: {
        submissionCount: {
          decrement: 1,
        },
      },
    });

    return ok(res);
  } catch (err) {
    logger.error(err);
    return serverError(res, 'Internal server error');
  }
});
