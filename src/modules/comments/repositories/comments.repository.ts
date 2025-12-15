import { commentsCollection } from '../../../core/db/mango.db';
import { CommentDBType } from '../types/comment.type';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { injectable } from 'inversify';

@injectable()
export class CommentsRepository {
  async createComment(dto: CommentDBType): Promise<string> {
    const result: InsertOneResult<CommentDBType> =
      await commentsCollection.insertOne(dto);

    return result?.insertedId.toString() ?? null;
  }

  async getCommentById(id: string | ObjectId): Promise<CommentDBType | null> {
    const comment: CommentDBType | null = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!comment) {
      return null;
    }

    return comment;
  }
  async updateComment(id: string, dto: UpdateCommentDto): Promise<boolean> {
    const result: UpdateResult<CommentDBType> =
      await commentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: dto },
      );

    return result.matchedCount === 1;
  }
  async removeComment(id: string): Promise<boolean> {
    const result: DeleteResult = await commentsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return result.deletedCount === 1;
  }
}
