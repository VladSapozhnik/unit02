import { Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { RequestWithParam } from '../../../../core/types/request.type';
import { DeviceIdParamDto } from '../../dto/device-id-param.dto';
import { securityDevicesService } from '../../application/security-devices.service';

export const removeDeviceSessionHandler = async (
  req: RequestWithParam<DeviceIdParamDto>,
  res: Response,
) => {
  const refreshToken: string = req.cookies.refreshToken;
  const deviceId: string = req.params.deviceId;

  console.log(refreshToken, deviceId);
  await securityDevicesService.removeDeviceSession(deviceId, refreshToken);

  res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
};
