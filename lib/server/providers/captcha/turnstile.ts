import { Form } from 'lib/types';
import { CaptchaSolver } from './solver-interface';
import { NextApiRequest } from 'next';
import { logger } from 'lib/logger';

export class TurnstileSolver implements CaptchaSolver {
  private request: NextApiRequest;
  private form: Form;

  constructor(request: NextApiRequest, form: Form) {
    this.request = request;
    this.form = form;
  }

  public async solve() {
    if (!this.submissionHasTurnstileResponse()) {
      return false;
    }

    if (!this.formHasTurnstileSecret()) {
      logger.error(`Form ${this.form.id} has no Turnstile secret key.`);

      // We don't want to block the submission if the form has no Turnstile secret key.
      return true;
    }

    const submission = this.request.body;

    const formData = new FormData();
    formData.append('secret', this.form.settings.captcha?.secretKey);
    formData.append('response', submission['cf-turnstile-response']);
    formData.append('remoteip', this.request.headers['x-forwarded-for'] as string);

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return !!data.success;
  }

  private submissionHasTurnstileResponse(): boolean {
    return !!this.request.body['cf-turnstile-response'];
  }

  private formHasTurnstileSecret(): boolean {
    return !!this.form.settings.captcha?.secretKey;
  }
}
