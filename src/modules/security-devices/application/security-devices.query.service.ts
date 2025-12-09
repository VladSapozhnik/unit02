import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { JwtPayload } from 'jsonwebtoken';
import { jwtAdapter } from '../../../core/adapters/jwt.adapter';
import { SecurityDevicesOutputType } from '../types/security-devices-output.type';
import { securityDevicesMapper } from '../mappers/security-devices.mapper';
import { SecurityDevicesType } from '../types/security-devices.type';
import { inject, injectable } from 'inversify';
import { SecurityDevicesQueryRepository } from '../repositories/security-devices.query.repository';

@injectable()
export class SecurityDevicesQueryService {
  constructor(
    @inject(SecurityDevicesQueryRepository)
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

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
      await this.securityDevicesQueryRepository.findDeviceSessionByUserId(
        payload.userId,
      );

    if (!sessions) {
      throw new UnauthorizedError('Unauthorized', 'session');
    }

    return sessions.map(securityDevicesMapper);
  }
}
