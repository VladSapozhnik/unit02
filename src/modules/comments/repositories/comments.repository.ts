import { commentCollection } from '../../../core/db/mango.db';
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
  async createComment(dto: CommentType): Promise<InsertOneResult<CommentType>> {
    return commentCollection.insertOne(dto);
  },
  async updateComment(
    id: string,
    dto: UpdateCommentDto,
  ): Promise<UpdateResult<CommentType>> {
    return commentCollection.updateOne({ _id: new ObjectId(id) }, dto);
  },
  async removeComment(id: string): Promise<DeleteResult> {
    return commentCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
