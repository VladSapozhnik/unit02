import { CommentsModel } from '../../../core/db/mango.db';
import { CommentDBType } from '../types/comment.type';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { CommentQueryInput } from '../routes/input/comment-query.input';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { injectable } from 'inversify';
import { Types } from 'mongoose';

@injectable()
export class CommentsQueryRepository {
  async getCommentById(id: string): Promise<CommentDBType | null> {
    return CommentsModel.findOne({
      _id: new Types.ObjectId(id),
    }).lean();
  }

  async getCommentsByPostId(queryDto: CommentQueryInput, postId: string) {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const comments: CommentDBType[] = await CommentsModel.find({
      postId: new Types.ObjectId(postId),
    })
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(skip)
      .limit(queryDto.pageSize)
      .lean();

    const totalCount: number = await CommentsModel.countDocuments({
      postId: new Types.ObjectId(postId),
    });

    const pagination: PaginatedMetaType = buildPaginationHelper(
      totalCount,
      queryDto.pageNumber,
      queryDto.pageSize,
    );

    return {
      comments,
      pagination,
    };
  }
}
