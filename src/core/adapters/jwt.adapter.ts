import jwt from 'jsonwebtoken';
import { settings } from '../settings/settings';

export const jwtAdapter = {
  async createAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId: userId.toString() }, settings.JWT_SECRET_KEY, {
      expiresIn: '10s',
    });
  },
  async createRefreshToken(userId: string): Promise<string> {
    return jwt.sign(
      { userId: userId.toString() },
      settings.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: '20s',
      },
    );
  },
  async verifyAccessToken(jwtToken: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(jwtToken, settings.JWT_SECRET_KEY);
      return result.userId.toString();
    } catch {
      return null;
    }
  },
  verifyRefreshToken(token: string) {
    return jwt.verify(token, settings.JWT_REFRESH_SECRET_KEY);
  },
};
