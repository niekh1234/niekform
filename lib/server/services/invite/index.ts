import { Project } from '@prisma/client';
import { randomBytes } from 'crypto';
import { hashToken } from 'lib/server/utils';
import { createTransport } from 'nodemailer';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';

export class InviteProvider {
  email: string;
  project: Project;
  emailProvider: any;
  baseUrl: string = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

  constructor(_email: string, _project: Project) {
    this.email = _email;
    this.project = _project;
    this.emailProvider = this.getNextAuthEmailProvider();
  }

  public async send() {
    const expiration = this.getExpiration();
    const token = await this.createToken();
    const url = await this.createUrl(token);

    await this.createVerificationToken(token, expiration);
    await this.sendEmail(url, token, expiration);
  }

  private async createToken() {
    const token =
      (await this.emailProvider.generateVerificationToken?.()) ?? randomBytes(32).toString('hex');

    return token;
  }

  private getNextAuthEmailProvider() {
    const emailProvider: any = nextAuthOptions.providers.find(
      (provider) => provider.id === 'email'
    );

    return emailProvider;
  }

  private getExpiration() {
    const ONE_DAY_IN_SECONDS = 86400;
    const expires = new Date(Date.now() + (this.emailProvider.maxAge ?? ONE_DAY_IN_SECONDS) * 1000);

    return expires;
  }

  private createVerificationToken(token: string, expires: Date) {
    return nextAuthOptions?.adapter?.createVerificationToken?.({
      identifier: this.email,
      token: hashToken(token, {
        provider: this.emailProvider,
        secret: nextAuthOptions.secret,
      }),
      expires,
    });
  }

  private async sendEmail(url: string, token: string, expires: Date) {
    const transporter = this.createTransporter();

    const params = {
      to: this.email,
      from: process.env.EMAIL_FROM,
      subject: `You're invited to join ${this.project.name} on ${process.env.NEXTAUTH_URL}`,
      text: `You have been invited to join ${this.project.name}. Click the link below to accept the invitation. ${url}`,
      html: `<p>You have been invited to join ${this.project.name}.</p><p>Click the link below to accept the invitation.</p><p>${url}</p>`,
    };

    await transporter.sendMail(params);
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

  private async createUrl(token: string) {
    const params = new URLSearchParams({ callbackUrl: this.baseUrl, token, email: this.email });

    return `${this.baseUrl}/api/auth/callback/${this.emailProvider.id}?${params}`;
  }
}
