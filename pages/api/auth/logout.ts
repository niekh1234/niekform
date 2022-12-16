import { removeTokenCookie } from 'lib/server/auth/cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  removeTokenCookie(res);
  res.writeHead(302, { location: '/login' });
  res.end();
});
