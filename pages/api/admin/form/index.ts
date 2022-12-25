import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { badRequest, ok, unauthorized } from 'lib/server/api';

export default nextConnect().post(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  const form = await prisma.form.create({
    data: {
      name: req.body.name,
      projectId: req.body.projectId,
    },
  });

  if (!form) {
    return badRequest(res, 'Form could not be created.');
  }

  return ok(res, { form });
});
