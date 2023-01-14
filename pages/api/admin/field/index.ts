import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { badRequest, ok, unauthorized } from 'lib/server/api';
import { logger } from 'lib/logger';
import { getSession } from 'next-auth/react';

export default nextConnect().post(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return unauthorized(res);
  }

  const form = await prisma.form.findFirst({
    where: {
      id: req.body.formId,
      project: {
        userId: session.userId,
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
    logger.info('Failed to create field for data: ' + JSON.stringify(req.body));
    return badRequest(res, 'Field could not be created.');
  }

  return ok(res, field);
});
