import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { ok, serverError, unauthorized } from 'lib/server/api';
import {
  submissionsForFormCountQuery,
  submissionsForFormQuery,
} from 'lib/server/queries/submissions';
import { logger } from 'lib/logger';

const DEFAULT_TAKE = 50;

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  try {
    const formId = req.query.id as string;
    const searchValue = req.query.search as string;

    const submissionsQuery = submissionsForFormQuery(
      formId,
      req.query.page,
      DEFAULT_TAKE,
      session,
      searchValue
    );
    const totalSubmissionsQuery = submissionsForFormCountQuery(formId, session, searchValue);

    const [submissions, totalSubmissions] = await prisma.$transaction([
      submissionsQuery,
      totalSubmissionsQuery,
    ]);

    const count = Number(Object.values(totalSubmissions[0])?.[0] || 0);

    const pagination = {
      page: req.query.page,
      take: DEFAULT_TAKE,
      total: count,
    };

    return ok(res, { submissions, pagination });
  } catch (err) {
    logger.error(err);

    return serverError(res);
  }
});
