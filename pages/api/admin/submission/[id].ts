import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { notFound, ok, unauthorized } from 'next-basics';
import nextConnect from 'next-connect';

export default nextConnect().delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

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

  return ok(res);
});
