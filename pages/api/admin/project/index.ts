import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { notFound, ok, unauthorized } from 'next-basics';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.userId,
      },
      include: {
        forms: true,
      },
    });

    return ok(res, projects);
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        description: req.body?.description,
        userId: session.userId,
      },
    });

    return ok(res, project);
  });
