import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { settings } from '../settings/settings';

export const jwtAdapter = {
  async createAccessToken(userId: string | ObjectId): Promise<string> {
    return jwt.sign({ userId: userId.toString() }, settings.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
  },
  async verifyAccessToken(jwtToken: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(jwtToken, settings.JWT_SECRET_KEY);
      return result.userId.toString();
    } catch {
      return null;
    }
  },
};
