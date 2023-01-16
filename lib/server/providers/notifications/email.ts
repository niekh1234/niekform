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
      if (error?.response) {
        console.error(error.response.body);
      }

      return false;
    }

    return true;
  }

  private createTransporter() {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;

    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASSWORD) {
      throw new Error('Missing email configuration');
    }

    return createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT),
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });
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
          (key, value) =>
            `<tr><th style="padding: 8px">${key}</th><td style="padding: 8px">${value}</td></tr>`
        )} 
     </tbody> 
    </table>`;
  }
}
