import { badRequest, ok, unauthorized } from 'lib/server/api';
import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  let [latestForms, submissionsByDay]: any[] = await prisma.$transaction([
    prisma.form.findMany({
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
    }),
    prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt")
      AS "date", COUNT(*) AS "count"
      FROM "Submission"
      WHERE "createdAt" > DATE_TRUNC('day', NOW()) - INTERVAL '30 days'
      AND "formId" IN (SELECT "id" FROM "Form" WHERE "projectId" IN (SELECT "id" FROM "Project" WHERE "userId" = ${session.id}))
      GROUP BY DATE_TRUNC('day', "createdAt")
      `,
  ]);

  // convert all bigints to numbers
  submissionsByDay = submissionsByDay.map((day: any) => ({
    date: day.date.toISOString().split('T')[0],
    count: Number(day.count),
  }));

  return ok(res, {
    latestForms,
    submissionsByDay,
  });
});
