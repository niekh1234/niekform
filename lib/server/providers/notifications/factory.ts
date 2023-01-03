import { Submission } from 'lib/types';
import { NotificationProvider } from './interface';
import { SendgridNotificationProvider } from './sendgrid';

export class NotificationFactory {
  public sendNotifications(submission: Submission) {
    const providers = this.getNotificationProviders(submission);

    for (const notificationProvider of providers) {
      notificationProvider.sendNotification();
    }
  }

  private getNotificationProviders(submission: Submission): NotificationProvider[] {
    return [new SendgridNotificationProvider(submission)];
  }
}
