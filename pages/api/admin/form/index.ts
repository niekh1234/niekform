import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { unauthorized } from 'next-basics';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { ok } from 'next-basics';

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

  return ok(res, form);
});
