import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { badRequest, ok, unauthorized } from 'lib/server/api';

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getLoginSession(req);

    if (!session) {
      return unauthorized(res);
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.id,
      },
      include: {
        forms: true,
      },
    });

    return ok(res, { projects });
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
        user: {
          connect: {
            id: session.id,
          },
        },
      },
    });

    if (!project) {
      return badRequest(res, 'Project could not be created.');
    }

    return ok(res, { project });
  });
