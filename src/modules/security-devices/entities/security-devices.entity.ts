import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

const SECURITY_DEVICES_COLLECTION_NAME = 'device_sessions';

type SecurityDevicesType = {
  userId: Types.ObjectId;
  deviceId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  expiresAt: Date;
};

type SecurityDeviceModelType = Model<SecurityDevicesType>;

export type SecurityDevicesDocument = HydratedDocument<SecurityDevicesType>;

export const securityDevicesSchema = new Schema<SecurityDevicesType>({
  userId: { type: Schema.Types.ObjectId, required: true },
  deviceId: { type: String, required: true },
  ip: { type: String, required: true, min: 1, max: 255 },
  title: { type: String, required: true, min: 1, max: 255 },
  lastActiveDate: { type: Date, required: true, min: 1, max: 255 },
  expiresAt: { type: Date, required: true, min: 1, max: 255 },
});

securityDevicesSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SecurityDevicesModel: SecurityDeviceModelType = model<
  SecurityDevicesType,
  SecurityDeviceModelType
>(SECURITY_DEVICES_COLLECTION_NAME, securityDevicesSchema);
