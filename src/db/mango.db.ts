import { Collection, Db, MongoClient } from 'mongodb';
import { settings } from '../settings/settings';

const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';

export let client: MongoClient;

export async function runDB(): Promise<void> {
  client = new MongoClient(settings.DB_URL);

  const db: Db = client.db(settings.DB_NAME);

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
