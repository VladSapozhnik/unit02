import { RateLimitType } from '../types/rate-limit.type';
import { rateLimitCollection } from '../../../core/db/mango.db';
import { InsertOneResult } from 'mongodb';
import { subSeconds } from 'date-fns/subSeconds';

export const rateLimitRepository = {
  async addAttempt(data: RateLimitType): Promise<string> {
    const result: InsertOneResult<RateLimitType> =
      await rateLimitCollection.insertOne(data);

    return result.insertedId.toString() ?? null;
  },
  async getAttemptsCount(ip: string, url: string): Promise<number> {
    const tenSecondsAgo: Date = subSeconds(new Date(), 10);

    return rateLimitCollection.countDocuments({
      ip,
      url,
      date: { $gt: tenSecondsAgo },
    });
  },
};
