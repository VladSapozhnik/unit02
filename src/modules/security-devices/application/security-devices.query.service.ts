import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { JwtPayload } from 'jsonwebtoken';
import { jwtAdapter } from '../../../core/adapters/jwt.adapter';
import { securityDevicesQueryRepository } from '../repositories/security-devices.query.repository';
import { SecurityDevicesOutputType } from '../types/security-devices-output.type';
import { securityDevicesMapper } from '../mappers/security-devices.mapper';
import { SecurityDevicesType } from '../types/security-devices.type';

export const securityDevicesQueryService = {
  async getSessionByUser(
    refreshToken: string,
  ): Promise<SecurityDevicesOutputType[]> {
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
      await securityDevicesQueryRepository.findDeviceSessionByUserId(
        payload.userId,
      );

    if (!sessions) {
      throw new UnauthorizedError('Unauthorized', 'session');
    }

    return sessions.map(securityDevicesMapper);
  },
};
