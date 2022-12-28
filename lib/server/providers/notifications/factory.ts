import { Submission } from 'lib/types';
import { NotificationProvider } from './interface';
import { SendgridNotificationProvider } from './sendgrid';

export class NotificationFactory {
  private notificationProviders: NotificationProvider[] = [SendgridNotificationProvider.prototype];

  public sendNotifications(submission: Submission) {
    for (const notificationProvider of this.notificationProviders) {
      notificationProvider.sendNotification(submission);
    }
  }
}
