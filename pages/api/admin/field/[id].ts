import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { notFound, ok, unauthorized } from 'next-basics';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';

export default nextConnect().delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  const { id } = req.query;

  const existingField = await prisma.field.findUnique({
    where: {
      id: id as string,
    },
    select: {
      form: {
        select: {
          project: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });

  if (!existingField || existingField.form.project.userId !== session.id) {
    return notFound(res);
  }

  const deleted = await prisma.field.delete({
    where: {
      id: id as string,
    },
  });

  return ok(res, deleted);
});
