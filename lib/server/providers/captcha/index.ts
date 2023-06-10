import { Form } from 'lib/types';
import { CaptchaSolverFactory } from './solver-factory';
import { NextApiRequest } from 'next';

export class CaptchaSolvingProvider {
  private request: NextApiRequest;
  private form: Form;

  constructor(request: NextApiRequest, form: Form) {
    this.request = request;
    this.form = form;
  }

  public async solve() {
    if (!this.hasCaptchaEnabled()) {
      return true;
    }

    const solver = CaptchaSolverFactory.create(this.request, this.form);
    return await solver.solve();
  }

  private hasCaptchaEnabled() {
    return !!this.form.settings.captcha?.type;
  }
}
