import { Collection, Db, MongoClient } from 'mongodb';
import { settings } from '../settings/settings';
import { BlogType } from '../../modules/blogs/types/blog.type';
import { PostType } from '../../modules/posts/types/post.type';

const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';

export let client: MongoClient;
export let blogCollection: Collection<BlogType>;
export let postCollection: Collection<PostType>;

export async function runDB(db_url: string): Promise<void> {
  client = new MongoClient(db_url);

  const db: Db = client.db(settings.DB_NAME);

  blogCollection = db.collection<BlogType>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<PostType>(POST_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
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
