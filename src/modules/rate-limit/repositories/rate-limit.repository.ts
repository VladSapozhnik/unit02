import { RateLimitType } from '../types/rate-limit.type';
import { rateLimitCollection } from '../../../core/db/mango.db';
import { InsertOneResult } from 'mongodb';

export const rateLimitRepository = {
  async addAttempt(data: RateLimitType): Promise<string> {
    const result: InsertOneResult<RateLimitType> =
      await rateLimitCollection.insertOne(data);

    return result.insertedId.toString() ?? null;
  },
  async getAttemptsCount(ip: string, url: string): Promise<number> {
    return rateLimitCollection.countDocuments({ ip, url });
  },
};
