import { Request, Response } from 'express';
import { SecurityDevicesOutputType } from '../../types/security-devices-output.type';
import { securityDevicesQueryService } from '../../application/security-devices.query.service';

export const getUserDevicesHandler = async (
  req: Request,
  res: Response<SecurityDevicesOutputType[]>,
) => {
  const refreshToken: string = req.cookies.refreshToken;

  const sessions: SecurityDevicesOutputType[] =
    await securityDevicesQueryService.getSessionByUser(refreshToken);

  res.json(sessions);
};
