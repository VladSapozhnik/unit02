import { Collection, Db, MongoClient } from 'mongodb';
import { settings } from '../settings/settings';
import { BlogType } from '../../modules/blogs/types/blog.type';
import { PostType } from '../../modules/posts/types/post.type';
import { UserDbType } from '../../modules/users/type/user.type';
import { CommentType } from '../../modules/comments/types/comment.type';
import { SecurityDevicesType } from '../../modules/security-devices/types/security-devices.type';
import { BlacklistType } from '../../modules/blacklist/types/blacklist.type';
import { RateLimitType } from '../../modules/rate-limit/types/rate-limit.type';

const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';
const USER_COLLECTION_NAME = 'users';
const COMMENT_COLLECTION_NAME = 'comments';
const BLACKLIST_COLLECTION_NAME = 'blacklist';
const SECURITY_DEVICES_COLLECTION_NAME = 'device_sessions';
const RATE_LIMIT = 'rate_limit';

export let client: MongoClient;
export let blogsCollection: Collection<BlogType>;
export let postsCollection: Collection<PostType>;
export let usersCollection: Collection<UserDbType>;
export let commentsCollection: Collection<CommentType>;
export let blacklistCollection: Collection<BlacklistType>;
export let securityDevicesCollection: Collection<SecurityDevicesType>;
export let rateLimitCollection: Collection<RateLimitType>;

export async function runDB(db_url: string): Promise<void> {
  client = new MongoClient(db_url);

  const db: Db = client.db(settings.DB_NAME);

  blogsCollection = db.collection<BlogType>(BLOG_COLLECTION_NAME);
  postsCollection = db.collection<PostType>(POST_COLLECTION_NAME);
  usersCollection = db.collection<UserDbType>(USER_COLLECTION_NAME);
  commentsCollection = db.collection<CommentType>(COMMENT_COLLECTION_NAME);
  blacklistCollection = db.collection<BlacklistType>(BLACKLIST_COLLECTION_NAME);
  securityDevicesCollection = db.collection<SecurityDevicesType>(
    SECURITY_DEVICES_COLLECTION_NAME,
  );
  rateLimitCollection = db.collection<RateLimitType>(RATE_LIMIT);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    await db
      .collection(BLACKLIST_COLLECTION_NAME)
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await db
      .collection(SECURITY_DEVICES_COLLECTION_NAME)
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDB(): Promise<void> {
  if (!client) {
    throw new Error('❌ No active client');
  }
  await client.close();
}
