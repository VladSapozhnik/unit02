import { Request, Response, NextFunction } from 'express';
import { RateLimitRepository } from '../../modules/rate-limit/repositories/rate-limit.repository';
import { TooManyRequestsError } from '../errors/too-many-requests.error';
import { settings } from '../settings/settings';
import { inject, injectable } from 'inversify';
import { RateLimitModel } from '../../modules/rate-limit/entities/rate-limit.entity';

@injectable()
export class RateLimitMiddleware {
  constructor(
    @inject(RateLimitRepository)
    private readonly rateLimitRepository: RateLimitRepository,
  ) {}

  async check(req: Request, res: Response, next: NextFunction) {
    const url: string = req.originalUrl;
    const ip: string = req.ip ?? 'unknown';

    const attemptsCount: number =
      await this.rateLimitRepository.getAttemptsCount(ip, url);

    if (attemptsCount >= 5 && settings.IS_TESTING !== 'testing') {
      throw new TooManyRequestsError(
        'Too many requests. Please try again after 10 seconds.',
      );
    }

    const attemptDate = new RateLimitModel({
      ip,
      url,
      date: new Date(),
    });

    await this.rateLimitRepository.addAttempt(attemptDate);

    next();
  }
}
