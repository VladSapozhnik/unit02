import { HTTP_STATUS } from '../enums/http-status.enum';
import { Response } from 'express';
import { NotFoundError } from './repository-not-found.error';

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof NotFoundError) {
    const httpStatus = HTTP_STATUS.NOT_FOUND_404;

    res.sendStatus(httpStatus);
    return;
  }

  res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
}
