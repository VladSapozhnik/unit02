import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

const PASSWORD_RECOVERY_COLLECTION_NAME = 'password_recovery';

type PasswordRecoveryType = {
  userId: Types.ObjectId;
  recoveryCode: string;
  expirationDate: Date;
  isUsed: boolean;
};

export type PasswordRecoveryDocument = HydratedDocument<PasswordRecoveryType>;

type PasswordRecoveryModelType = Model<PasswordRecoveryDocument>;

export const passwordRecoverySchema = new Schema<PasswordRecoveryType>({
  userId: { type: Schema.Types.ObjectId, required: true },
  recoveryCode: { type: String, required: true, min: 1 },
  expirationDate: { type: Date, required: true, min: 1 },
  isUsed: { type: Boolean, required: true },
});

export const PasswordRecoveryModel: PasswordRecoveryModelType = model<
  PasswordRecoveryType,
  PasswordRecoveryModelType
>(PASSWORD_RECOVERY_COLLECTION_NAME, passwordRecoverySchema);
