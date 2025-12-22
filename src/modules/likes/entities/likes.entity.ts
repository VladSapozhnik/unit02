import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';
import { LikeStatusEnum } from '../enums/like-status.enum';

const LIKE_COLLECTION_NAME = 'likes';

type LikesType = {
  userId: Types.ObjectId;
  commentId: Types.ObjectId;
  status: LikeStatusEnum;
  createdAt: Date;
};

type LikeModelType = Model<LikesType>;

export type LikesDocument = HydratedDocument<LikesType>;

export const likesSchema = new Schema<LikesType>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    commentId: { type: Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: Object.values(LikeStatusEnum),
      required: true,
    },
  },
  { timestamps: true },
);

export const LikeModel: LikeModelType = model<LikesType, LikeModelType>(
  LIKE_COLLECTION_NAME,
  likesSchema,
);
