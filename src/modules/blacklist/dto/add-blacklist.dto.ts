export type AddBlacklistDto = {
  token: string;
  deviceId: string;
  userId: string;
  expiresAt: Date;
};
