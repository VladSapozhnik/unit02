import { blacklistCollection } from '../../../core/db/mango.db';
import { BlacklistType } from '../types/blacklist.type';
import { DeleteResult, InsertOneResult, ObjectId, WithId } from 'mongodb';

export const blacklistRepository = {
  async addToBlacklist(dto: BlacklistType): Promise<string> {
    const result: InsertOneResult<WithId<BlacklistType>> =
      await blacklistCollection.insertOne(dto);

    return result.insertedId.toString();
  },
  async isTokenBlacklisted(
    token: string,
    userId: string,
  ): Promise<WithId<BlacklistType> | null> {
    return blacklistCollection.findOne({ token, userId: new ObjectId(userId) });
  },
  async cleanExpiredBlacklist(): Promise<number> {
    const result: DeleteResult = await blacklistCollection.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return result.deletedCount;
  },
};
