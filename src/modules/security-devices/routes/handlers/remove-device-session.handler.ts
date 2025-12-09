// import { Response } from 'express';
// import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
// import { RequestWithParam } from '../../../../core/types/request.type';
// import { DeviceIdParamDto } from '../../dto/device-id-param.dto';
// import { securityDevicesService } from '../../application/security-devices.service';
// import { Result } from '../../../../core/types/result.type';
// import { ResultStatus } from '../../../../core/enums/result-status.enum';
//
// export const removeDeviceSessionHandler = async (
//   req: RequestWithParam<DeviceIdParamDto>,
//   res: Response,
// ) => {
//   const refreshToken: string = req.cookies.refreshToken;
//   const deviceId: string = req.params.deviceId;
//
//   const result: Result<null> = await securityDevicesService.removeDeviceSession(
//     deviceId,
//     refreshToken,
//   );
//
//   if (result.status === ResultStatus.Unauthorized) {
//     res.status(HTTP_STATUS.UNAUTHORIZED_401).json(result.extensions);
//     return;
//   }
//
//   if (result.status === ResultStatus.NotFound) {
//     res.status(HTTP_STATUS.NOT_FOUND_404).json(result.extensions);
//     return;
//   }
//
//   if (result.status === ResultStatus.Forbidden) {
//     res.status(HTTP_STATUS.FORBIDDEN_403).json(result.extensions);
//     return;
//   }
//
//   res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
// };
