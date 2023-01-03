import { Submission } from 'lib/types';
import { NotificationProvider } from './interface';

export class SendgridNotificationProvider implements NotificationProvider {
  private submission: Submission;

  public constructor(submission: Submission) {
    this.submission = submission;
  }

  public async sendNotification() {
    // Send notification via Sendgrid
    const emailSettings = await this.getMailSettings();

    if (!emailSettings?.sendTo) {
      return false;
    }

    this.sendEmailTo(emailSettings.sendTo);

    return true;
  }

  private sendEmailTo(email: string): boolean {
    const message = this.formatMessage();

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

    if (!form) {
      return null;
    }

    return form.notifcationSettings;
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
