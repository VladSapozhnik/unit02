import { blacklistCollection } from '../../../core/db/mango.db';
import { BlacklistType } from '../types/blacklist.type';
import { DeleteResult, InsertOneResult, ObjectId, WithId } from 'mongodb';
import { AddBlacklistDto } from '../dto/add-blacklist.dto';

export const blacklistRepository = {
  async addToBlacklist(dto: AddBlacklistDto): Promise<string> {
    const result: InsertOneResult<WithId<BlacklistType>> =
      await blacklistCollection.insertOne({
        ...dto,
        userId: new ObjectId(dto.userId),
      });

    return result.insertedId.toString();
  },
  async isTokenBlacklisted(
    token: string,
    userId: string,
    deviceId: string,
  ): Promise<WithId<BlacklistType> | null> {
    return blacklistCollection.findOne({
      token,
      userId: new ObjectId(userId),
      deviceId,
    });
  },
  async cleanExpiredBlacklist(): Promise<number> {
    const result: DeleteResult = await blacklistCollection.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return result.deletedCount;
  },
};
