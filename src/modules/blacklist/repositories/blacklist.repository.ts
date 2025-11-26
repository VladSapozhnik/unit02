import { blacklistCollection } from '../../../core/db/mango.db';
import { BlacklistType } from '../types/blacklist.type';
import { DeleteResult, InsertOneResult, WithId } from 'mongodb';

export const blacklistRepository = {
  async addToBlacklist(dto: BlacklistType): Promise<string> {
    const result: InsertOneResult<WithId<BlacklistType>> =
      await blacklistCollection.insertOne(dto);

    return result.insertedId.toString();
  },
  async cleanExpiredBlacklist(): Promise<number> {
    const result: DeleteResult = await blacklistCollection.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return result.deletedCount;
  },
};
