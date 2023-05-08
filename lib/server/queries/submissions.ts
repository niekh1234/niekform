import { PrismaPromise, Submission } from '@prisma/client';
import prisma from 'lib/prisma';
import { Session } from 'next-auth';

export const latest30DaysOfSubmissions = async (userId: string): Promise<any> => {
  if (process.env.DATABASE_PROVIDER === 'postgres') {
    const rawData: Submission[] | null = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") AS date, COUNT(*) AS myCount
      FROM "Submission"
      WHERE "createdAt" > DATE(NOW()) - INTERVAL '30 days'
      AND "formId" IN (SELECT id FROM "Form" WHERE "projectId" IN (SELECT id FROM "Project" WHERE "userId" = ${userId}))
      GROUP BY DATE_TRUNC('day', "createdAt")
    `;

    return rawData?.map((day: any) => ({
      date: day.date.toISOString().split('T')[0],
      count: Number(day.mycount) || 0,
    }));
  }

  const rawData: Submission[] | null = await prisma.$queryRaw`
    SELECT DATE(createdAt)
    AS date, COUNT(*) AS myCount
    FROM Submission
    WHERE createdAt > DATE(NOW()) - INTERVAL 30 DAY
    AND formId IN (SELECT id FROM Form WHERE projectId IN (SELECT id FROM Project WHERE userId = ${userId}))
    GROUP BY DATE(createdAt)
  `;

  return rawData?.map((day: any) => ({
    date: day.date.toISOString().split('T')[0],
    count: Number(day.myCount) || 0,
  }));
};

export const submissionsForFormQuery = (
  formId: string,
  page: any,
  take: number,
  session: Session,
  searchQuery: string = ''
): PrismaPromise<Submission[] | null> => {
  if (process.env.DATABASE_PROVIDER === 'postgres') {
    return prisma.$queryRaw`
      SELECT * FROM "Submission"
      WHERE "formId" = ${formId}
      AND "formId" IN (SELECT "id" FROM "Form" WHERE "projectId" IN (SELECT "id" FROM "Project" WHERE "userId" = ${
        session.userId
      }))
      AND "rawdata"::text ILIKE ${`%${searchQuery}%`}
      ORDER BY "createdAt" DESC
      LIMIT ${take}
      OFFSET ${getSkip(page, take)}
    `;
  }

  return prisma.$queryRaw`
      SELECT *
      FROM Submission
      WHERE formId = ${formId}
      AND formId IN (SELECT id FROM Form WHERE projectId IN (SELECT id FROM Project WHERE userId = ${
        session.userId
      }))
      AND LOWER(rawdata) LIKE ${`%${searchQuery.toLowerCase()}%`}
      ORDER BY createdAt DESC
      LIMIT ${take}
      OFFSET ${getSkip(page, take)};
    `;
};

export const submissionsForFormCountQuery = (
  formId: string,
  session: Session,
  searchQuery: string = ''
): PrismaPromise<any> => {
  if (process.env.DATABASE_PROVIDER === 'postgres') {
    return prisma.$queryRaw`
      SELECT COUNT(*)
      FROM "Submission"
      WHERE "formId" = ${formId}
      AND "rawdata"::text ILIKE ${`%${searchQuery}%`}
      AND "formId" IN (SELECT "id" FROM "Form" WHERE "projectId" IN (SELECT "id" FROM "Project" WHERE "userId" = ${
        session.userId
      }))
    `;
  }

  return prisma.$queryRaw`
      SELECT COUNT(*)
      FROM Submission
      WHERE formId = ${formId}
      AND LOWER(rawdata) LIKE ${`%${searchQuery.toLowerCase()}%`}
      AND formId IN (SELECT id FROM Form WHERE projectId IN (SELECT id FROM Project WHERE userId = ${
        session.userId
      }))
    `;
};

export const getDuplicateSubmissions = (formId: string, session: Session) => {
  if (process.env.DATABASE_PROVIDER === 'postgres') {
    return prisma.$queryRaw`
      SELECT DISTINCT ON ("Submission"."rawdata") "Submission".*
      FROM "Submission"
      JOIN (
        SELECT "rawdata", COUNT(*) as count
        FROM "Submission"
        WHERE "formId" = ${formId}
        AND "formId" IN (SELECT "id" FROM "Form" WHERE "projectId" IN (SELECT "id" FROM "Project" WHERE "userId" = ${session.userId}))
        GROUP BY "rawdata"
        HAVING COUNT(*) > 1
      ) AS "GroupedSubmissions" ON "Submission"."rawdata" = "GroupedSubmissions"."rawdata"
      WHERE "Submission"."formId" = ${formId}
      ORDER BY "Submission"."rawdata";
    `;
  }

  return prisma.$queryRaw`
    SELECT Submission.rawdata, Submission.id, Submission.createdAt, Submission.formId
    FROM Submission
    JOIN (
      SELECT MIN(id) as min_id, rawdata
      FROM Submission
      WHERE formId = ${formId}
      AND formId IN (SELECT id FROM Form WHERE projectId IN (SELECT id FROM Project WHERE userId = ${session.userId}))
      GROUP BY rawdata
      HAVING COUNT(*) > 1
    ) AS GroupedSubmissions ON Submission.id = GroupedSubmissions.min_id
    WHERE Submission.formId = ${formId}
    ORDER BY Submission.rawdata;
    `;
};

const getSkip = (page: any, take: number) => {
  if (!page || isNaN(Number(page))) {
    return 0;
  }

  return (Number(page) - 1) * take;
};
