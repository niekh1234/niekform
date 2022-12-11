import { setLoginSession } from 'lib/server/auth';
import { localStrategy } from 'lib/server/auth/passport-local';
import { NextApiRequest, NextApiResponse } from 'next';
import { ok, unauthorized } from 'next-basics';
import nextConnect from 'next-connect';
import passport, { Strategy } from 'passport';

const authenticate = (
  method: Strategy,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  return new Promise((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        reject(error);
      }

      resolve(token);
    })(req, res);
  });
};

passport.use(localStrategy);

export default nextConnect()
  .use(passport.initialize())
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const user = await authenticate('local' as unknown as Strategy, req, res);

      if (!user) {
        throw new Error();
      }

      const session = { ...user };

      await setLoginSession(res, session);

      const { password, ...publicUser } = user;

      return ok(res, { user: publicUser });
    } catch (err: any) {
      return unauthorized(
        res,
        JSON.stringify({ message: 'Invalid username or password' })
      );
    }
  });
