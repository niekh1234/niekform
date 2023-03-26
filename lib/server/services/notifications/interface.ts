export interface NotificationProvider {
  sendNotification(): Promise<boolean>;
}
