import { badRequest, ok, serverError, unauthorized } from 'lib/server/api';
import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { latest30DaysOfSubmissions } from 'lib/server/queries/submissions';

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  try {
    let latestForms = await prisma.form.findMany({
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

    const submissionsByDay = await latest30DaysOfSubmissions(session.id);

    console.log('submissionsByDay', submissionsByDay);

    return ok(res, {
      latestForms,
      submissionsByDay,
    });
  } catch (err) {
    console.log(err);
    return serverError(res, 'Internal server error');
  }
});
