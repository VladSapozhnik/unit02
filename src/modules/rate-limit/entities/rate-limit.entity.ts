import mongoose, { HydratedDocument, Model, Schema } from 'mongoose';

const RATE_LIMIT_COLLECTION_NAME = 'rate_limit';

type RateLimitType = {
  ip: string;
  url: string;
  date: Date;
};

type RateLimitModelType = Model<RateLimitType>;

export type RateLimitDocument = HydratedDocument<RateLimitType>;

export const rateLimitSchema = new Schema<RateLimitType>({
  ip: { type: String, required: true, min: 1, max: 255 },
  url: { type: String, required: true, min: 1, max: 255 },
  date: { type: Date, required: true, min: 1, max: 255 },
});

export const RateLimitModel: RateLimitModelType = mongoose.model<
  RateLimitType,
  RateLimitModelType
>(RATE_LIMIT_COLLECTION_NAME, rateLimitSchema);
