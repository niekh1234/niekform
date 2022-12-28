import { Submission } from 'lib/types';

export interface NotificationProvider {
  sendNotification(submission: Submission): Promise<boolean>;
}
