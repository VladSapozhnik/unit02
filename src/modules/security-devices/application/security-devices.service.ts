import { UnauthorizedError } from '../../../core/errors/unauthorized.error';
import { securityDevicesRepository } from '../repositories/security-devices.repository';
import { JwtPayload } from 'jsonwebtoken';
import { jwtAdapter } from '../../../core/adapters/jwt.adapter';
import { SecurityDevicesType } from '../types/security-devices.type';
import { Result } from '../../../core/types/result.type';
import { ResultStatus } from '../../../core/enums/result-status.enum';
import { ObjectId, WithId } from 'mongodb';
import { securityDevicesCollection } from '../../../core/db/mango.db';

export const securityDevicesService = {
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

    const findDeviceId: SecurityDevicesType | null =
      await securityDevicesRepository.findDeviceSessionByDeviceId(deviceId);

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

    await securityDevicesRepository.removeDeviceSession(
      findDeviceId.userId.toString(),
      deviceId,
    );

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
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
