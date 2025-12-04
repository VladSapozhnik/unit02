import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { securityDevicesRepository } from '../repositories/security-devices.repository';
import { JwtPayload } from 'jsonwebtoken';
import { jwtAdapter } from '../../../core/adapters/jwt.adapter';
import { ForbiddenRequestError } from '../../../core/errors/forbidden-request.error';
import { SecurityDevicesType } from '../types/security-devices.type';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { WithId } from 'mongodb';
import { blacklistRepository } from '../../blacklist/repositories/blacklist.repository';
import { BlacklistType } from '../../blacklist/types/blacklist.type';
import { AddBlacklistDto } from '../../blacklist/dto/add-blacklist.dto';

export const securityDevicesService = {
  async removeDeviceSession(deviceId: string, refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    if (!payload || !payload.userId || payload.deviceId || !payload.exp) {
      throw new UnauthorizedError('Unauthorized', 'refreshToken');
    }

    const userId: string = payload.userId as string;

    const findDeviceId: SecurityDevicesType | null =
      await securityDevicesRepository.findDeviceSessionByDeviceId(deviceId);

    if (!findDeviceId) {
      throw new NotFoundError('Device session not found', 'session');
    }

    if (
      findDeviceId.userId !== payload.userId ||
      findDeviceId.deviceId !== payload.deviceId
    ) {
      throw new ForbiddenRequestError('Forbidden', 'session');
    }

    const isBlacklisted: WithId<BlacklistType> | null =
      await blacklistRepository.isTokenBlacklisted(
        refreshToken,
        userId,
        deviceId,
      );

    if (isBlacklisted) {
      throw new UnauthorizedError('Unauthorized', 'logout');
    }

    const blackList: AddBlacklistDto = {
      token: refreshToken,
      userId: userId,
      deviceId: deviceId,
      expiresAt: new Date(payload.exp * 1000),
    };

    await blacklistRepository.addToBlacklist(blackList);

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

    const userId: string = payload.userId;
    const deviceId: string = payload.deviceId;

    await securityDevicesRepository.removeOtherDeviceSession(userId, deviceId);
  },
};
