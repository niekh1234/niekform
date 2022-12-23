import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { ok, unauthorized } from 'lib/server/api';

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  const formId = req.query.id as string;

  const submissions = await prisma.submission.findMany({
    where: {
      formId,
      form: {
        project: {
          userId: session.id,
        },
      },
    },
  });

  return ok(res, { submissions });
});
