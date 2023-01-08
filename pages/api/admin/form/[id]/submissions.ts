import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { ok, serverError, unauthorized } from 'lib/server/api';
import { PrismaPromise } from '@prisma/client';
import { Session, Submission } from 'lib/types';

const DEFAULT_TAKE = 50;

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  console.log(session.id);

  try {
    const formId = req.query.id as string;
    const searchValue = req.query.search as string;

    const submissionsQuery = getQuery(formId, req.query.page, DEFAULT_TAKE, session, searchValue);
    const totalSubmissionsQuery = getCountQuery(formId, session, searchValue);

    // const [submissions, totalSubmissions] = await prisma.$transaction([
    //   submissionsQuery,
    //   totalSubmissionsQuery,
    // ]);

    // const count = Number(totalSubmissions?.[0].count);

    const submissions = await submissionsQuery;

    const pagination = {
      page: req.query.page,
      take: DEFAULT_TAKE,
      total: 10,
    };

    return ok(res, { submissions, pagination });
  } catch (err) {
    console.log(err);

    return serverError(res);
  }
});

const getSkip = (page: any, take: number) => {
  if (!page) {
    return 0;
  }

  return (page - 1) * take;
};

const getQuery = (
  formId: string,
  page: any,
  take: number,
  session: Session,
  searchQuery: string = ''
): PrismaPromise<Submission[] | null> => {
  // // do a raw query on the jsonb column loosely matching the search query
  return prisma.$queryRaw`
      SELECT *
      FROM Submission
      WHERE formId = ${formId}
      AND formId IN (SELECT id FROM Form WHERE projectId IN (SELECT id FROM Project WHERE userId = ${
        session.id
      }))
      LIMIT 10
      -- AND "rawData"::text LIKE ${`%${searchQuery}%`}
      -- ORDER BY createdAt DESC
      -- LIMIT ${take}
      -- OFFSET ${getSkip(page, take)}
    `;
};

const getCountQuery = (
  formId: string,
  session: Session,
  searchQuery: string = ''
): PrismaPromise<any> => {
  return prisma.$queryRaw`
      SELECT COUNT(*)
      FROM "Submission"
      WHERE "formId" = ${formId}
  `;
  // return prisma.$queryRaw`
  //     SELECT COUNT(*)
  //     FROM "Submission"
  //     WHERE "formId" = ${formId}
  //     AND "rawData"::text LIKE ${`%${searchQuery}%`}
  //     AND "formId" IN (SELECT "id" FROM "Form" WHERE "projectId" IN (SELECT "id" FROM "Project" WHERE "userId" = ${
  //       session.id
  //     }))
  //   `;
};
// SELECT *
// FROM Submission
// WHERE formId = "clcn95ghl0005w7g561izah4e"
// AND formId IN (SELECT id FROM Form WHERE projectId IN (SELECT id FROM Project WHERE userId = "clcn95fqi0002w7g5zzhn7qk3"))

// ORDER BY createdAt DESC
// LIMIT 10
// OFFSET 0;
