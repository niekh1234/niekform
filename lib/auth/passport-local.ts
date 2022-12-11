import Local from 'passport-local';
import { findUser, validatePassword } from 'lib/auth/user';

export const localStrategy = new Local.Strategy(async (email, password, done) => {
  try {
    const user = await findUser({ email });

    if (user && (await validatePassword(user, password))) {
      done(null, user);
    } else {
      done(new Error('Invalid email or password'));
    }
  } catch (err) {
    done(err);
  }
});
