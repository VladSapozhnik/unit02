import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';

export const removeOtherSessionsHandler = (req: Request, res: Response) => {
  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
