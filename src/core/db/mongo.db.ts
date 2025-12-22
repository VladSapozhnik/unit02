import mongoose from 'mongoose';
import { settings } from '../settings/settings';

const dbName: string = settings.DB_NAME;

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
