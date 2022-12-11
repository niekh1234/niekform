import Iron from '@hapi/iron';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  getTokenCookie,
  MAX_AGE,
  setTokenCookie,
} from 'lib/server/auth/cookies';

const TOKEN_SECRET =
  process.env.TOKEN_SECRET ||
  'set_an_env_variable_and_this_has_to_be_minimum_32_characters';

export const setLoginSession = async (res: NextApiResponse, session: any) => {
  const createdAt = Date.now();

  const sessionObj = { ...session, createdAt, maxAge: MAX_AGE };
  const token = await Iron.seal(sessionObj, TOKEN_SECRET, Iron.defaults);

  setTokenCookie(res, token);
};

export const getLoginSession = async (req: NextApiRequest) => {
  const token = getTokenCookie(req);

  if (!token) {
    return;
  }

  const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
  const expiresAt = session.createdAt + session.maxAge * 1000;

  if (Date.now() > expiresAt) {
    throw new Error('Session expired');
  }

  return session;
};
