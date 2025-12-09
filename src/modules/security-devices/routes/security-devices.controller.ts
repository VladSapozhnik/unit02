import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { SecurityDevicesOutputType } from '../types/security-devices-output.type';
import { RequestWithParam } from '../../../core/types/request.type';
import { DeviceIdParamDto } from '../dto/device-id-param.dto';
import { Result } from '../../../core/types/result.type';
import { ResultStatus } from '../../../core/enums/result-status.enum';
import { HTTP_STATUS } from '../../../core/enums/http-status.enum';
import { SecurityDevicesService } from '../application/security-devices.service';
import { SecurityDevicesQueryService } from '../application/security-devices.query.service';

@injectable()
export class SecurityDevicesController {
  constructor(
    @inject(SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService,
    @inject(SecurityDevicesQueryService)
    private readonly securityDevicesQueryService: SecurityDevicesQueryService,
  ) {}

  async getUserDevices(
    req: Request,
    res: Response<SecurityDevicesOutputType[]>,
  ) {
    const refreshToken: string = req.cookies.refreshToken;

    const sessions: SecurityDevicesOutputType[] =
      await this.securityDevicesQueryService.getSessionByUser(refreshToken);

    res.json(sessions);
  }

  async removeDeviceSession(
    req: RequestWithParam<DeviceIdParamDto>,
    res: Response,
  ) {
    const refreshToken: string = req.cookies.refreshToken;
    const deviceId: string = req.params.deviceId;

    const result: Result<null> =
      await this.securityDevicesService.removeDeviceSession(
        deviceId,
        refreshToken,
      );

    if (result.status === ResultStatus.Unauthorized) {
      res.status(HTTP_STATUS.UNAUTHORIZED_401).json(result.extensions);
      return;
    }

    if (result.status === ResultStatus.NotFound) {
      res.status(HTTP_STATUS.NOT_FOUND_404).json(result.extensions);
      return;
    }

    if (result.status === ResultStatus.Forbidden) {
      res.status(HTTP_STATUS.FORBIDDEN_403).json(result.extensions);
      return;
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async removeOtherSessions(req: Request, res: Response) {
    const refreshToken: string = req.cookies.refreshToken;

    await this.securityDevicesService.removeOtherDeviceSession(refreshToken);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}
