import { getLoginSession } from 'lib/auth';
import { findUser } from 'lib/auth/user';
import { NextApiRequest, NextApiResponse } from 'next';
import { ok, serverError } from 'next-basics';
import nextConnect from 'next-connect';

export default nextConnect().get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getLoginSession(req);

    if (!session) {
      throw new Error();
    }

    const user = await findUser(session);

    if (!user) {
      throw new Error();
    }

    const { password, ...publicUser } = user;

    return ok(res, { user: publicUser });
  } catch (err) {
    return serverError(res, 'Authentication token is invalid, please log in.');
  }
});
