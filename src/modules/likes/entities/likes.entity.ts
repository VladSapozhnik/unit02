import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { LikeTargetEnum } from '../enums/like-target.enum';

const LIKE_COLLECTION_NAME = 'likes';

type LikesType = {
  userId: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: LikeTargetEnum;
  status: LikeStatusEnum;
  createdAt: Date;
};

type LikeModelType = Model<LikesType>;

export type LikesDocument = HydratedDocument<LikesType>;

export const likesSchema = new Schema<LikesType>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: {
      type: String,
      enum: LikeTargetEnum,
      required: true,
    },
    status: {
      type: String,
      enum: LikeStatusEnum,
      required: true,
    },
  },
  { timestamps: true },
);

export const LikeModel: LikeModelType = model<LikesType, LikeModelType>(
  LIKE_COLLECTION_NAME,
  likesSchema,
);
