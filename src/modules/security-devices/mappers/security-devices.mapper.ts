import { SecurityDevicesDBType } from '../types/security-devices.type';
import { SecurityDevicesOutputType } from '../types/security-devices-output.type';

export const securityDevicesMapper = (
  data: SecurityDevicesDBType,
): SecurityDevicesOutputType => {
  return {
    ip: data.ip,
    title: data.title,
    lastActiveDate: data.lastActiveDate,
    deviceId: data.deviceId,
  };
};
