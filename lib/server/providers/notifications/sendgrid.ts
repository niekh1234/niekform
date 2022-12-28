import { Submission } from 'lib/types';
import { NotificationProvider } from './interface';

export class SendgridNotificationProvider implements NotificationProvider {
  private submission: Submission;

  public constructor(submission: Submission) {
    this.submission = submission;
  }

  public static make(submission: Submission) {
    return new this(submission);
  }

  public async sendNotification(submission: Submission) {
    // Send notification via Sendgrid
    const emailSettings = await this.getMailSettings();

    console.log(emailSettings);

    return true;
  }

  private formatMessageArguments(message: string) {
    return {
      to: '',
    };
  }

  private async getMailSettings() {
    const form = await prisma.form.findUnique({
      where: {
        id: this.submission.formId,
      },
    });

    return form;
  }

  private async formNotificationSettings(formId: string) {
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

    return form;
  }
}
