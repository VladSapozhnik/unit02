import mongoose, { model } from 'mongoose';
import { settings } from '../settings/settings';
import { likesSchema } from './schemas';
import { LikesDbType } from '../../modules/likes/types/likes.type';

const dbName: string = settings.DB_NAME;

const LIKE_COLLECTION_NAME = 'likes';

// export const BlogsModel = model<BlogDBType>(BLOG_COLLECTION_NAME, blogsSchema);
// export const UsersModel = model<UserDbType>(USER_COLLECTION_NAME, usersSchema);
// export const CommentsModel = model<CommentDBType>(
//   COMMENT_COLLECTION_NAME,
//   commentsSchema,
// );
// export const SecurityDevicesModel = model<SecurityDevicesDBType>(
//   SECURITY_DEVICES_COLLECTION_NAME,
//   securityDevicesSchema,
// );
// export const PasswordRecoveryModel = model<PasswordRecoveryDBType>(
//   PASSWORD_RECOVERY_COLLECTION_NAME,
//   passwordRecoverySchema,
// );

// export const RateLimitModel = model<RateLimitDBType>(
//   RATE_LIMIT,
//   rateLimitSchema,
// );

export const LikesModel = model<LikesDbType>(LIKE_COLLECTION_NAME, likesSchema);

export async function runDB(db_url: string): Promise<void> {
  try {
    await mongoose.connect(db_url, { dbName });
    console.log('✅ Connected to the database');
  } catch (e) {
    console.error('❌ Database connection error:', e);
    await mongoose.disconnect();
    throw new Error(
      `❌ Database connection failed: ${e instanceof Error ? e.message : e}`,
    );
  }
}

export async function stopDB(): Promise<void> {
  await mongoose.disconnect();
}
