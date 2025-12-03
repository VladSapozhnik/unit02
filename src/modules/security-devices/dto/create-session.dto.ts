export type CreateSessionDto = {
  userId: string;
  deviceId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  expiresAt: Date;
};
