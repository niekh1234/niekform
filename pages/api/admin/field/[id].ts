import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { notFound, ok, unauthorized } from 'lib/server/api';
import { getSession } from 'next-auth/react';

export default nextConnect().delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session?.user) {
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
              users: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (
    !existingField ||
    !existingField.form.project.users.some((user) => user.id !== session.userId)
  ) {
    return notFound(res);
  }

  const deleted = await prisma.field.delete({
    where: {
      id: id as string,
    },
  });

  return ok(res, deleted);
});
