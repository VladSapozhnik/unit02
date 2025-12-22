import { RateLimitDBType } from '../types/rate-limit.type';
import { RateLimitModel } from '../../../core/db/mongo.db';
import { subSeconds } from 'date-fns/subSeconds';
import { injectable } from 'inversify';

@injectable()
export class RateLimitRepository {
  async addAttempt(data: RateLimitDBType): Promise<string> {
    const result: RateLimitDBType = await RateLimitModel.create(data);

    return result._id.toString();
  }

  async getAttemptsCount(ip: string, url: string): Promise<number> {
    const tenSecondsAgo: Date = subSeconds(new Date(), 10);

    return RateLimitModel.countDocuments({
      ip,
      url,
      date: { $gt: tenSecondsAgo },
    });
  }
}

// export const rateLimitRepository = {
//   async addAttempt(data: RateLimitType): Promise<string> {
//     const result: InsertOneResult<RateLimitType> =
//       await rateLimitCollection.insertOne(data);
//
//     return result.insertedId.toString() ?? null;
//   },
//   async getAttemptsCount(ip: string, url: string): Promise<number> {
//     const tenSecondsAgo: Date = subSeconds(new Date(), 10);
//
//     return rateLimitCollection.countDocuments({
//       ip,
//       url,
//       date: { $gt: tenSecondsAgo },
//     });
//   },
// };
