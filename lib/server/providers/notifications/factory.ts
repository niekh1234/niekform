import { Submission } from 'lib/types';
import { NotificationProvider } from './interface';
import { SendgridNotificationProvider } from './sendgrid';

export class NotificationFactory {
  public async sendNotifications(submission: Submission): Promise<void> {
    const providers = this.getNotificationProviders(submission);

    for (const notificationProvider of providers) {
      await notificationProvider.sendNotification();
    }
  }

  private getNotificationProviders(submission: Submission): NotificationProvider[] {
    return [new SendgridNotificationProvider(submission)];
  }
}
