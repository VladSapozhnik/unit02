import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { JwtPayload } from 'jsonwebtoken';
import { jwtAdapter } from '../../../core/adapters/jwt.adapter';
import { Result } from '../../../core/types/result.type';
import { ResultStatus } from '../../../core/enums/result-status.enum';
import { inject, injectable } from 'inversify';
import { SecurityDevicesRepository } from '../repositories/security-devices.repository';
import { SecurityDevicesDocument } from '../entities/security-devices.entity';

@injectable()
export class SecurityDevicesService {
  constructor(
    @inject(SecurityDevicesRepository)
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async removeDeviceSession(
    deviceId: string,
    refreshToken: string,
  ): Promise<Result<null>> {
    let payload: JwtPayload;

    try {
      payload = jwtAdapter.verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
      // throw new UnauthorizedError('Unauthorized', 'refreshToken');
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Unauthorized' }],
      };
    }

    if (!payload || !payload.userId || !payload.deviceId || !payload.exp) {
      // throw new UnauthorizedError('Unauthorized', 'refreshToken');
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Unauthorized' }],
      };
    }

    const findDeviceId: SecurityDevicesDocument | null =
      await this.securityDevicesRepository.findDeviceSessionByDeviceId(
        deviceId,
      );

    if (!findDeviceId) {
      // throw new NotFoundError('Device session not found', 'session');
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'NotFound',
        data: null,
        extensions: [{ field: 'session', message: 'Device session not found' }],
      };
    }

    if (findDeviceId.userId.toString() !== payload.userId.toString()) {
      // throw new ForbiddenRequestError('Forbidden', 'session');
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Forbidden',
        data: null,
        extensions: [{ field: 'session', message: 'Forbidden' }],
      };
    }

    await this.securityDevicesRepository.removeDeviceSession(
      findDeviceId.userId.toString(),
      deviceId,
    );

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }

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

    await this.securityDevicesRepository.removeOtherDeviceSession(
      payload.userId,
      payload.deviceId,
    );
  }
}
