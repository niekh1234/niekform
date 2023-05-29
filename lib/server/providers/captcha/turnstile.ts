import { Form, Submission } from 'lib/types';

export class TurnstileSolver {
  submission: Submission;
  form: Form;

  constructor(submission: Submission, form: Form) {
    this.submission = submission;
    this.form = form;
  }

  public async solve() {
    const captchaSettings = this.form.settings.captcha;

    console.log(this.submission);
  }
}
