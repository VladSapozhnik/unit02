import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { securityDevicesRepository } from '../../modules/security-devices/repositories/security-devices.repository';
import { jwtAdapter } from '../adapters/jwt.adapter';
import { JwtPayload } from 'jsonwebtoken';

export const validateRefreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken: string = req.cookies.refreshToken;

  let payload: JwtPayload;

  try {
    payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Unauthorized', 'refreshToken');
  }

  const userId: string = payload.userId as string;
  const deviceId: string = payload.deviceId as string;

  const session =
    await securityDevicesRepository.findDeviceSessionByUserIdAndDeviceId(
      userId,
      deviceId,
    );

  if (!session) {
    throw new UnauthorizedError('Session not found', 'validate');
  }

  (req as any).refreshPayload = payload;

  next();
};
