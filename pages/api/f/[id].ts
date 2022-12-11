import { NextApiRequest, NextApiResponse } from 'next';
import { badRequest, ok, notFound } from 'next-basics';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import {
  cleanSubmission,
  validateSubmission,
} from 'lib/server/form/submission';

export default nextConnect().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.id) {
      return badRequest(res, 'Missing id');
    }

    // todo honey pot

    const form = await prisma.form.findFirst({
      where: { id: req.query.id as string },
      include: { fields: true },
    });

    if (!form) {
      return notFound(res, 'Form not found');
    }

    const { errors, valid } = validateSubmission(form.fields, req.body);

    if (!valid) {
      return badRequest(res, JSON.stringify({ errors }));
    }

    const cleaned = cleanSubmission(form.fields, req.body);

    const submission = await prisma.submission.create({
      data: {
        formId: form.id,
        data: cleaned,
      },
    });

    return ok(res, submission || {});
  }
);