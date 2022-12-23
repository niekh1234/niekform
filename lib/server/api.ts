import { NextApiResponse } from 'next';

export const ok = (res: NextApiResponse, data: any = { message: 'Success' }) => {
  return res.status(200).json(data);
};

export const unauthorized = (
  res: NextApiResponse,
  message: string = 'You are not allowed to do that'
) => {
  return res.status(401).json({ message });
};

export const badRequest = (res: NextApiResponse, message: string = 'Something went wrong') => {
  return res.status(403).json({ message });
};

export const notFound = (res: NextApiResponse, message: string = 'Not found') => {
  return res.status(404).json({ message });
};

export const serverError = (res: NextApiResponse, message: string = 'Internal server error') => {
  return res.status(500).json({ message });
};
