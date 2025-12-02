import { Request, Response } from 'express';
import { securityDevicesService } from '../../application/security-devices.service';
import { SecurityDevicesType } from '../../types/security-devices.type';

export const getUserDevicesHandler = async (
  req: Request,
  res: Response<SecurityDevicesType[]>,
) => {
  const refreshToken: string = req.cookies.refreshToken;

  const sessions: SecurityDevicesType[] =
    await securityDevicesService.getSessionByUser(refreshToken);

  res.json(sessions);
};
