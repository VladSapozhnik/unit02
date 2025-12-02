import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { securityDevicesRepository } from '../repositories/security-devices.repository';
import { JwtPayload } from 'jsonwebtoken';
import { jwtAdapter } from '../../../core/adapters/jwt.adapter';
import { SecurityDevicesType } from '../types/security-devices.type';

export const securityDevicesService = {
  async getSessionByUser(refreshToken: string): Promise<SecurityDevicesType[]> {
    let payload: JwtPayload;

    try {
      payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    if (!payload || !payload.userId) {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    const sessions: SecurityDevicesType[] | null =
      await securityDevicesRepository.findDeviceSessionByUserId(payload.userId);

    if (!sessions) {
      throw new UnauthorizedError('Unauthorized', 'session');
    }

    return sessions;
  },

  async removeDeviceSession(deviceId: string, refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    if (!payload || !payload.userId) {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    const isRemoveSession: boolean =
      await securityDevicesRepository.removeDeviceSession(
        payload.userId,
        deviceId,
      );

    if (!isRemoveSession) {
      throw new UnauthorizedError('Unauthorized', 'session');
    }
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
