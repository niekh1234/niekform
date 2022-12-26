import Local from 'passport-local';
import { findUserByEmail, validatePassword } from 'lib/server/auth/user';

export const localStrategy = new Local.Strategy(async (email, password, done) => {
  try {
    const user = await findUserByEmail(email);

    if (user && (await validatePassword(user, password))) {
      done(null, user);
    } else {
      done(new Error('Invalid email or password'));
    }
  } catch (err) {
    done(err);
  }
});
