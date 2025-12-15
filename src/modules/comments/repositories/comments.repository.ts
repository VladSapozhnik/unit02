import { CommentsModel } from '../../../core/db/mango.db';
import { CommentDBType } from '../types/comment.type';
import { Types, DeleteResult, UpdateResult } from 'mongoose';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { injectable } from 'inversify';

@injectable()
export class CommentsRepository {
  async createComment(dto: CommentDBType): Promise<string> {
    const result: CommentDBType = await CommentsModel.create(dto);

    return result._id.toString();
  }

  async getCommentById(
    id: string | Types.ObjectId,
  ): Promise<CommentDBType | null> {
    const comment: CommentDBType | null = await CommentsModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!comment) {
      return null;
    }

    return comment;
  }
  async updateComment(id: string, dto: UpdateCommentDto): Promise<boolean> {
    const result: UpdateResult = await CommentsModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: dto },
    );

    return result.matchedCount === 1;
  }
  async removeComment(id: string): Promise<boolean> {
    const result: DeleteResult = await CommentsModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return result.deletedCount === 1;
  }
}
