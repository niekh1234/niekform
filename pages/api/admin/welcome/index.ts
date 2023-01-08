import { badRequest, ok, serverError, unauthorized } from 'lib/server/api';
import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  try {
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
      SELECT DATE(createdAt)
      AS date, COUNT(*) AS myCount
      FROM Submission
      WHERE createdAt > DATE(NOW()) - INTERVAL 30 DAY
      AND formId IN (SELECT id FROM Form WHERE projectId IN (SELECT id FROM Project WHERE userId = ${session.id}))
      GROUP BY DATE(createdAt)
      `,
    ]);

    // convert all bigints to numbers
    submissionsByDay = submissionsByDay.map((day: any) => ({
      date: day.date.toISOString().split('T')[0],
      count: Number(day.myCount) || 0,
    }));

    return ok(res, {
      latestForms,
      submissionsByDay,
    });
  } catch (err) {
    console.log(err);
    return serverError(res, 'Internal server error');
  }
});
