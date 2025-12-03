import { SecurityDevicesType } from '../types/security-devices.type';

export const securityDevicesMapper = (data: SecurityDevicesType) => {
  return {
    ip: data.ip,
    title: data.title,
    lastActiveDate: data.lastActiveDate,
    deviceId: data.deviceId,
  };
};
