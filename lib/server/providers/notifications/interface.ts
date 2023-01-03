import { Submission } from 'lib/types';

export interface NotificationProvider {
  sendNotification(): Promise<boolean>;
}
