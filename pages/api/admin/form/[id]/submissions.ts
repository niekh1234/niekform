import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { ok, unauthorized } from 'lib/server/api';

const DEFAULT_TAKE = 20;

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  const formId = req.query.id as string;

  const submissionsQuery = prisma.submission.findMany({
    where: {
      formId,
      form: {
        project: {
          userId: session.id,
        },
      },
    },
    take: DEFAULT_TAKE,
    orderBy: {
      createdAt: 'desc',
    },
    skip: getSkip(req.query.page, DEFAULT_TAKE),
  });

  const totalSubmissionsQuery = prisma.submission.count({
    where: {
      formId,
      form: {
        project: {
          userId: session.id,
        },
      },
    },
  });

  const [submissions, totalSubmissions] = await prisma.$transaction([
    submissionsQuery,
    totalSubmissionsQuery,
  ]);

  const pagination = {
    page: req.query.page,
    take: DEFAULT_TAKE,
    total: totalSubmissions,
  };

  return ok(res, { submissions, pagination });
});

const getSkip = (page: any, take: number) => {
  if (!page) {
    return 0;
  }

  return (page - 1) * take;
};
