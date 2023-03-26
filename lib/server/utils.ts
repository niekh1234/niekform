import { createHash } from 'crypto';

export const hashToken = (token: string, options: any) => {
  const { provider, secret } = options;

  return createHash('sha256')
    .update(`${token}${provider.secret ?? secret}`)
    .digest('hex');
};
