import { CommentDocument, CommentModel } from '../entities/comment.entity';
import { Types, DeleteResult } from 'mongoose';
import { injectable } from 'inversify';

@injectable()
export class CommentsRepository {
  async createComment(comment: CommentDocument): Promise<string> {
    // const result: CommentDocument = await CommentModel.create(dto);
    const result: CommentDocument = await comment.save();

    return result._id.toString();
  }

  async getCommentById(
    id: string | Types.ObjectId,
  ): Promise<CommentDocument | null> {
    const comment: CommentDocument | null = await CommentModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!comment) {
      return null;
    }

    return comment;
  }
  async updateComment(comment: CommentDocument): Promise<string> {
    // const result: UpdateResult = await CommentModel.updateOne(
    //   { _id: new Types.ObjectId(id) },
    //   { $set: dto },
    // );

    const result: CommentDocument = await comment.save();

    return result._id.toString();
  }
  async removeComment(comment: CommentDocument): Promise<boolean> {
    // const result: DeleteResult = await CommentModel.deleteOne({
    //   _id: new Types.ObjectId(id),
    // });

    const result: DeleteResult = await comment.deleteOne();

    return result.deletedCount === 1;
  }
}
