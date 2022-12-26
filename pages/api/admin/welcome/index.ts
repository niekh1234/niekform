import { ok, unauthorized } from 'lib/server/api';
import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  const latestSubmissions = await prisma.submission.findMany({
    where: {
      form: {
        project: {
          userId: session.id,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  const latestForms = await prisma.form.findMany({
    where: {
      project: {
        userId: session.id,
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

  return ok(res, {
    latestSubmissions,
    latestForms,
  });
});
