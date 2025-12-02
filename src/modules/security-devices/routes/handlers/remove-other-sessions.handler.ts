import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { securityDevicesService } from '../../application/security-devices.service';

export const removeOtherSessionsHandler = async (
  req: Request,
  res: Response,
) => {
  const refreshToken: string = req.cookies.refreshToken;

  await securityDevicesService.removeOtherDeviceSession(refreshToken);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
