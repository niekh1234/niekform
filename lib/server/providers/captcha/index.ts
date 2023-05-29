import { Form, Submission } from 'lib/types';
import { TurnstileSolver } from './turnstile';

export class CaptchaSolvingProvider {
  submission: Submission;
  form: Form;

  constructor(submission: Submission, form: Form) {
    this.submission = submission;
    this.form = form;
  }

  public async solve() {
    if (!this.hasCaptchaSettings()) {
      return true;
    }

    const solver = this.getSolver();
    await solver.solve();
  }

  private hasCaptchaSettings() {
    return !!this.form.settings.captcha?.type;
  }

  private getSolver() {
    if (!this.form.settings.captcha) throw new Error('No captcha settings');

    switch (this.form.settings.captcha.type) {
      // case 'hcaptcha':
      //   return new HCaptchaSolver(this.submission, this.form);
      // case 'recaptcha':
      //   return new ReCaptchaSolver(this.submission, this.form);
      case 'turnstile':
        return new TurnstileSolver(this.submission, this.form);
      default:
        throw new Error('Invalid captcha type');
    }
  }
}
