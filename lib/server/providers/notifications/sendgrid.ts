import { Form, Submission } from 'lib/types';
import { NotificationProvider } from './interface';
import sgMail from '@sendgrid/mail';

export class SendgridNotificationProvider implements NotificationProvider {
  private submission: Submission;

  public constructor(submission: Submission) {
    this.submission = submission;
  }

  public async sendNotification() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const form = await this.getTheForm();
    const { notificationSettings } = form;

    if (!notificationSettings?.sendTo) {
      return false;
    }

    await this.sendEmailTo(notificationSettings.sendTo, form);

    return true;
  }

  private async sendEmailTo(email: string, form: Form): Promise<boolean> {
    const message = this.formatMessage(email, form);

    try {
      await sgMail.send(message);
    } catch (error: any) {
      if (error?.response) {
        console.error(error.response.body);
      }

      return false;
    }

    return true;
  }

  private formatMessage(email: string, form: Form) {
    return {
      to: email,
      from: email,
      subject: `New submission from ${form.name}`,
      text: `You have just received a new submission for your form ${
        form.name
      }. Data: ${Object.values(this.submission.rawdata).join(' ')}`,
      html: this.createHTML(),
    };
  }

  private async getTheForm() {
    return await prisma.form.findUnique({
      where: {
        id: this.submission.formId,
      },
    });
  }

  private createHTML() {
    return `<table>
     <tbody>
        ${Object.entries(this.submission.rawdata).map(
          (key, value) => `<tr><td>${key}</td><td>${value}</td></tr>`
        )} 
     </tbody> 
    </table>`;
  }
}
