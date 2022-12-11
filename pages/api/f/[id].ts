import { NextApiRequest, NextApiResponse } from 'next';
import { badRequest, ok, redirect, notFound } from 'next-basics';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import { Field, FieldType, Form } from '@prisma/client';

export default nextConnect().post(async (req: NextApiRequest, res: NextApiResponse) => {
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

  return ok(res, cleanSubmission(form.fields, req.body));

  const submission = await prisma.submission.create({
    data: {
      formId: form.id,
      data: JSON.stringify(req.body),
    },
  });

  return ok(res, submission || {});

  redirect(res, '');
});

const cleanSubmission = (formFields: Field[], submission: any) => {
  const clean: any = {};

  formFields.forEach((field) => {
    const fieldName = field.name.toLowerCase();

    clean[fieldName] = '';

    if (submission[fieldName]) {
      clean[fieldName] = submission[fieldName];

      if (field.type === FieldType.CHECKBOX) {
        clean[fieldName] = !!submission[fieldName];
      }
    }
  });

  return clean;
};

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   console.log(req.body, req.method);

//   ok(res, { message: 'ok' });
// };
