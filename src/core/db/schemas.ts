import { Schema } from 'mongoose';
import { CommentDBType } from '../../modules/comments/types/comment.type';
import { BlogDBType } from '../../modules/blogs/types/blog.type';
import { PasswordRecoveryDBType } from '../../modules/password-recovery/types/password-recovery.type';
import { PostDBType } from '../../modules/posts/types/post.type';
import { RateLimitDBType } from '../../modules/rate-limit/types/rate-limit.type';
import { SecurityDevicesDBType } from '../../modules/security-devices/types/security-devices.type';
import {
  EmailConfirmation,
  UserDbType,
} from '../../modules/users/type/user.type';
import { LikeStatusEnum } from '../../modules/likes/enums/like-status.enum';
import { LikesDbType } from '../../modules/likes/types/likes.type';

// export const blogsSchema = new Schema<BlogDBType>({
//   _id: { type: Schema.Types.ObjectId, required: true },
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   websiteUrl: { type: String, required: true },
//   createdAt: { type: Date, required: true },
//   isMembership: { type: Boolean, default: false },
// });

const commentsInfoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    userLogin: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const commentsSchema = new Schema<CommentDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  postId: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  commentatorInfo: commentsInfoSchema,
  createdAt: { type: Date, required: true },
});

export const passwordRecoverySchema = new Schema<PasswordRecoveryDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  recoveryCode: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  isUsed: { type: Boolean, required: true },
});

export const postsSchema = new Schema<PostDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: Schema.Types.ObjectId, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

export const rateLimitSchema = new Schema<RateLimitDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true },
});

export const securityDevicesSchema = new Schema<SecurityDevicesDBType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  deviceId: { type: String, required: true },
  ip: { type: String, required: true },
  title: { type: String, required: true },
  lastActiveDate: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

securityDevicesSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const emailConfirmation = new Schema<EmailConfirmation>(
  {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, default: false },
  },
  { _id: false },
);

export const usersSchema = new Schema<UserDbType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  login: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true },
  emailConfirmation: emailConfirmation,
});

export const likesSchema = new Schema<LikesDbType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  commentId: { type: Schema.Types.ObjectId, required: true },
  status: { type: String, enum: Object.values(LikeStatusEnum), required: true },
  createdAt: { type: Date, required: true },
});
