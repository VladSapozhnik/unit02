import { Request, Response, NextFunction } from 'express';
import { rateLimitRepository } from '../../modules/rate-limit/repositories/rate-limit.repository';
import { RateLimitType } from '../../modules/rate-limit/types/rate-limit.type';
import { add } from 'date-fns/add';
import { TooManyRequestsError } from '../errors/too-many-requests.error';

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

  if (attemptsCount >= 5) {
    throw new TooManyRequestsError(
      'Too many requests. Please try again after 10 seconds.',
    );
  }

  const attemptDate: RateLimitType = {
    ip,
    url,
    date: add(new Date(), { seconds: 10 }),
  };

  await rateLimitRepository.addAttempt(attemptDate);

  next();
};
