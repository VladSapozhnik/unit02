import { subSeconds } from 'date-fns/subSeconds';
import { injectable } from 'inversify';
import {
  RateLimitDocument,
  RateLimitModel,
} from '../entities/rate-limit.entity';

@injectable()
export class RateLimitRepository {
  async addAttempt(data: RateLimitDocument): Promise<string> {
    const result: RateLimitDocument = await data.save();

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
