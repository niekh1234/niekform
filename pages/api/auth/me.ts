import { ok, serverError } from 'lib/server/api';
import { getLoginSession } from 'lib/server/auth';
import { findUser } from 'lib/server/auth/user';
import { NextApiRequest, NextApiResponse } from 'next';
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
