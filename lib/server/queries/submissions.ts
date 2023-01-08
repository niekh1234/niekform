import { PrismaPromise, Submission } from '@prisma/client';
import { Session } from 'lib/types';

export const latest30DaysOfSubmissions = async (userId: string): Promise<any> => {
  if (process.env.DATABASE_PROVIDER === 'postgres') {
    const rawData = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") AS date, COUNT(*) AS myCount
      FROM "Submission"
      WHERE "createdAt" > DATE(NOW()) - INTERVAL '30 days'
      AND "formId" IN (SELECT id FROM "Form" WHERE "projectId" IN (SELECT id FROM "Project" WHERE "userId" = ${userId}))
      GROUP BY DATE_TRUNC('day', "createdAt")
    `;

    return rawData.map((day: any) => ({
      date: day.date.toISOString().split('T')[0],
      count: Number(day.mycount) || 0,
    }));
  }

  const rawData = await prisma.$queryRaw`
    SELECT DATE(createdAt)
    AS date, COUNT(*) AS myCount
    FROM Submission
    WHERE createdAt > DATE(NOW()) - INTERVAL 30 DAY
    AND formId IN (SELECT id FROM Form WHERE projectId IN (SELECT id FROM Project WHERE userId = ${userId}))
    GROUP BY DATE(createdAt)
  `;

  return rawData.map((day: any) => ({
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
        session.id
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
        session.id
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
        session.id
      }))
    `;
  }

  return prisma.$queryRaw`
      SELECT COUNT(*)
      FROM Submission
      WHERE formId = ${formId}
      AND LOWER(rawdata) LIKE ${`%${searchQuery.toLowerCase()}%`}
      AND formId IN (SELECT id FROM Form WHERE projectId IN (SELECT id FROM Project WHERE userId = ${
        session.id
      }))
    `;
};

const getSkip = (page: any, take: number) => {
  if (!page || isNaN(Number(page))) {
    return 0;
  }

  return (Number(page) - 1) * take;
};
