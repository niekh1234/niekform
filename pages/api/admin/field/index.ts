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

  const form = await prisma.form.findFirst({
    where: {
      id: req.body.formId,
      project: {
        userId: session.id,
      },
    },
    include: {
      fields: true,
    },
  });

  if (!form) {
    return badRequest(res, 'Form not found.');
  }

  if (form.fields.some((field) => field.key === req.body.key)) {
    return badRequest(res, 'Field with this key already exists');
  }

  const field = await prisma.field.create({
    data: {
      key: req.body.key,
      label: req.body.label,
      formId: req.body.formId,
      required: req.body.required,
      type: req.body.type.toUpperCase(),
    },
  });

  if (!field) {
    return badRequest(res, 'Field could not be created.');
  }

  return ok(res, field);
});
