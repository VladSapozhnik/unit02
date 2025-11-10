import jwt from 'jsonwebtoken';
import { settings } from '../../../core/settings/settings';
import { ObjectId } from 'mongodb';

export const jwtService = {
  async createAccessToken(userId: string | ObjectId): Promise<string> {
    return jwt.sign({ userId: String(userId) }, settings.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
  },
  async verifyAccessToken(jwtToken: string): Promise<ObjectId | null> {
    try {
      const result: any = jwt.verify(jwtToken, settings.JWT_SECRET_KEY);
      return new ObjectId(String(result.userId));
    } catch {
      return null;
    }
  },
};
