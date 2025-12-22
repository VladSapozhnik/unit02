import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { CommentQueryInput } from '../routes/input/comment-query.input';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { CommentDocument, CommentModel } from '../entities/comment.entity';

@injectable()
export class CommentsQueryRepository {
  async getCommentById(id: string): Promise<CommentDocument | null> {
    return CommentModel.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  async getCommentsByPostId(queryDto: CommentQueryInput, postId: string) {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const comments: CommentDocument[] = await CommentModel.find({
      postId: new Types.ObjectId(postId),
    })
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(skip)
      .limit(queryDto.pageSize);

    const totalCount: number = await CommentModel.countDocuments({
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
