import { badRequest, unauthorized } from 'lib/server/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';
import prisma from 'lib/prisma';
import ExportFactory from 'lib/server/providers/export/factory';

const SUPPORTED_EXPORT_TYPES = ['csv', 'json'];

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return unauthorized(res);
  }

  const { formId, type } = req.query as { formId: string; type: string };

  if (!formId || !type || !SUPPORTED_EXPORT_TYPES.includes(type)) {
    return badRequest(res, 'Invalid request');
  }

  const ownsForm = await prisma.form.findFirst({
    where: {
      id: formId,
      project: {
        userId: session.userId,
      },
    },
  });

  if (!ownsForm) {
    return unauthorized(res);
  }

  const submissions = await prisma.submission.findMany({
    where: {
      formId: ownsForm.id,
    },
  });

  const exporter = ExportFactory.make(type, submissions);
  const file = exporter.export();
  const fileName = `niekform-${formId}-${new Date().getTime()}.${type}`;

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.setHeader('Content-Length', file.length);

  res.send(file);
});
