import { commentsCollection } from '../../../core/db/mango.db';
import { CommentType } from '../types/comment.type';
import {
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';
import { UpdateCommentDto } from '../dto/update-comment.dto';

export const commentsRepository = {
  async createComment(dto: CommentType): Promise<string> {
    const result: InsertOneResult<WithId<CommentType>> =
      await commentsCollection.insertOne(dto);

    return result?.insertedId.toString() ?? null;
  },
  async getCommentById(
    id: string | ObjectId,
  ): Promise<WithId<CommentType> | null> {
    const comment: WithId<CommentType> | null =
      await commentsCollection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return null;
    }

    return comment;
  },
  async updateComment(id: string, dto: UpdateCommentDto): Promise<boolean> {
    const result: UpdateResult<WithId<CommentType>> =
      await commentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: dto },
      );

    return result.matchedCount === 1;
  },
  async removeComment(id: string): Promise<boolean> {
    const result: DeleteResult = await commentsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return result.deletedCount === 1;
  },
};
