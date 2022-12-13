import { getLoginSession } from 'lib/server/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { badRequest, unauthorized } from 'next-basics';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { ok } from 'next-basics';

export default nextConnect().post(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getLoginSession(req);

  if (!session) {
    return unauthorized(res);
  }

  const field = await prisma.field.create({
    data: {
      name: req.body.name,
      formId: req.body.formId,
      required: req.body.required,
      type: req.body.type,
    },
  });

  if (!field) {
    return badRequest(res, 'Field could not be created.');
  }

  return ok(res, field);
});
