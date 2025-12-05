import { Request, Response, NextFunction } from 'express';
import { rateLimitRepository } from '../../modules/rate-limit/repositories/rate-limit.repository';
import { RateLimitType } from '../../modules/rate-limit/types/rate-limit.type';
import { TooManyRequestsError } from '../errors/too-many-requests.error';
import { settings } from '../settings/settings';

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const url: string = req.originalUrl;
  const ip: string = req.ip ?? 'unknown';

  const attemptsCount: number = await rateLimitRepository.getAttemptsCount(
    ip,
    url,
  );

  if (attemptsCount >= 5 && settings.IS_TESTING !== 'testing') {
    throw new TooManyRequestsError(
      'Too many requests. Please try again after 10 seconds.',
    );
  }

  const attemptDate: RateLimitType = {
    ip,
    url,
    date: new Date(),
  };

  await rateLimitRepository.addAttempt(attemptDate);

  next();
};
