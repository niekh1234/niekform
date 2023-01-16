import { logger } from 'lib/logger';
import { Form, Submission } from 'lib/types';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NotificationProvider } from './interface';

export class EmailNotificationProvider implements NotificationProvider {
  private submission: Submission;
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  public constructor(submission: Submission) {
    this.submission = submission;
    this.transporter = this.createTransporter();
  }

  public async sendNotification() {
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
      await this.transporter.sendMail(message);
    } catch (error: any) {
      logger.info('Error sending email', error);

      return false;
    }

    return true;
  }

  private createTransporter() {
    const { EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD } =
      process.env;

    if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
      throw new Error('Missing email configuration');
    }

    return createTransport({
      host: EMAIL_SERVER_HOST,
      port: parseInt(EMAIL_SERVER_PORT),
      auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASSWORD,
      },
    });
  }

  private formatMessage(email: string, form: Form) {
    return {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: `New submission from ${form.name}`,
      text: `You have just received a new submission for your form ${
        form.name
      }. Data: ${Object.values(this.submission.rawdata).join(', ')}`,
      html: this.createHTML(form),
    };
  }

  private async getTheForm() {
    return await prisma.form.findUnique({
      where: {
        id: this.submission.formId,
      },
    });
  }

  private createHTML(form: Form) {
    return `
<h1 style="font-size: 24px">New submissions from ${form.name}</h1>
<table>
  <tbody>
    ${Object.entries(this.submission.rawdata)
      .map(
        ([key, value]) =>
          `<tr><th style="padding: 8px">${key}</th><td style="padding: 8px">${value}</td></tr>`
      )
      .join('')} 
  </tbody> 
</table>`;
  }
}
