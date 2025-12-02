export type CreateSessionDto = {
  userId: string;
  deviceId: string;
  ip: string;
  title: string;
  issuedAt: Date;
  expiresAt: Date;
};
