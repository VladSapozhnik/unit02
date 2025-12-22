import { SecurityDevicesOutputType } from '../types/security-devices-output.type';
import { SecurityDevicesDocument } from '../entities/security-devices.entity';

export const securityDevicesMapper = (
  data: SecurityDevicesDocument,
): SecurityDevicesOutputType => {
  return {
    ip: data.ip,
    title: data.title,
    lastActiveDate: data.lastActiveDate,
    deviceId: data.deviceId,
  };
};
