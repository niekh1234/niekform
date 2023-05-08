import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { ok, serverError, unauthorized } from 'lib/server/api';
import { logger } from 'lib/logger';
import { getSession } from 'next-auth/react';
import { getDuplicateSubmissions } from 'lib/server/queries/submissions';

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session?.user) {
      return unauthorized(res);
    }

    const formId = req.query.id as string;

    try {
      const duplicateSubmissions = await getDuplicateSubmissions(formId, session);
      return ok(res, { duplicateSubmissions });
    } catch (error) {
      logger.error(error);
      return serverError(res, 'Failed to get duplicate submissions.');
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session?.user) {
      return unauthorized(res);
    }

    const formId = req.query.id as string;
    const submissionIds = req.body?.ids as string[] | undefined;

    await prisma.submission.deleteMany({
      where: {
        id: {
          in: submissionIds,
        },
        form: {
          id: formId,
          project: {
            userId: session.userId,
          },
        },
      },
    });

    return ok(res);
  });
