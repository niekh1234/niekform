import { Form } from 'lib/types';
import { CaptchaSolver } from './solver-interface';
import { TurnstileSolver } from './turnstile';
import { NextApiRequest } from 'next';

export class CaptchaSolverFactory {
  public static create(request: NextApiRequest, form: Form): CaptchaSolver {
    switch (this.getCaptchaType(form)) {
      case 'turnstile':
        return new TurnstileSolver(request, form);
      default:
        throw new Error('Invalid captcha type');
    }
  }

  private static getCaptchaType(form: Form): string | undefined {
    return form?.settings?.captcha?.type;
  }
}
