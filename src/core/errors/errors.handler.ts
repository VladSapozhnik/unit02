import { HTTP_STATUS } from '../enums/http-status.enum';
import { Response } from 'express';
import { NotFoundError } from './repository-not-found.error';
import { ErrorResponse, ErrorType } from '../types/error.type';
import { BadRequestError } from './bad-request.error';

function errorMessage(error: ErrorType): ErrorResponse {
  return {
    errorsMessages: [
      {
        field: error.field || 'unknown',
        message: error.message || 'Resource error',
      },
    ],
  };
}

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof NotFoundError) {
    const httpStatus: HTTP_STATUS.NOT_FOUND_404 = HTTP_STATUS.NOT_FOUND_404;

    res.status(httpStatus).json(errorMessage(error));
    return;
  }
  if (error instanceof BadRequestError) {
    const httpStatus: HTTP_STATUS.BAD_REQUEST_400 = HTTP_STATUS.BAD_REQUEST_400;

    res.status(httpStatus).json(errorMessage(error));
    return;
  }

  res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
}
