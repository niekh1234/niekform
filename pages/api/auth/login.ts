import { ok, unauthorized } from 'lib/server/api';
import { setLoginSession } from 'lib/server/auth';
import { localStrategy } from 'lib/server/auth/passport-local';
import { NextApiRequest, NextApiResponse } from 'next';
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
      const user: any = await authenticate('local' as unknown as Strategy, req, res);

      if (!user) {
        throw new Error();
      }

      const { password, ...session } = user;

      await setLoginSession(res, session);

      return ok(res, { user: session });
    } catch (err: any) {
      return unauthorized(res, JSON.stringify({ message: 'Invalid username or password' }));
    }
  });
