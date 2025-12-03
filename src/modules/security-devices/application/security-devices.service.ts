import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { securityDevicesRepository } from '../repositories/security-devices.repository';
import { JwtPayload } from 'jsonwebtoken';
import { jwtAdapter } from '../../../core/adapters/jwt.adapter';
import { ForbiddenRequestError } from '../../../core/errors/forbidden-request.error';
import { SecurityDevicesType } from '../types/security-devices.type';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';

export const securityDevicesService = {
  async removeDeviceSession(deviceId: string, refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    if (!payload || !payload.userId || !payload.exp) {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    const findDeviceId: SecurityDevicesType | null =
      await securityDevicesRepository.findDeviceSessionByDeviceId(deviceId);

    if (!findDeviceId) {
      throw new NotFoundError('Device session not found', 'session');
    }

    if (findDeviceId.userId !== payload.userId) {
      throw new ForbiddenRequestError('Forbidden', 'session');
    }

    await securityDevicesRepository.removeDeviceSession(
      payload.userId,
      deviceId,
    );
  },

  async removeOtherDeviceSession(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    if (!payload || !payload.userId || !payload.deviceId) {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    await securityDevicesRepository.removeOtherDeviceSession(
      payload.userId,
      payload.deviceId,
    );
  },
};
