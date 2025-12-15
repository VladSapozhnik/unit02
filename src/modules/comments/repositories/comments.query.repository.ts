import { ObjectId } from 'mongodb';
import { commentsCollection } from '../../../core/db/mango.db';
import { CommentDBType } from '../types/comment.type';
import { commentMapper } from '../mappers/comment.mapper';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { CommentQueryInput } from '../routes/input/comment-query.input';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { paginatedListMapper } from '../../../core/mappers/paginated-list.mapper';
import { injectable } from 'inversify';
import { CommentOutputType } from '../types/comment-output.type';

@injectable()
export class CommentsQueryRepository {
  async getCommentById(
    id: string | ObjectId,
  ): Promise<CommentOutputType | null> {
    const comment: CommentDBType | null = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!comment) {
      return null;
    }

    return commentMapper(comment);
  }

  async getCommentsByPostId(queryDto: CommentQueryInput, postId: ObjectId) {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const comments: CommentDBType[] = await commentsCollection
      .find({ postId: new ObjectId(postId) })
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(skip)
      .limit(queryDto.pageSize)
      .toArray();

    const totalCount: number = await commentsCollection.countDocuments({
      postId: new ObjectId(postId),
    });

    const pagination: PaginatedMetaType = buildPaginationHelper(
      totalCount,
      queryDto.pageNumber,
      queryDto.pageSize,
    );
    return paginatedListMapper<CommentDBType, CommentOutputType>(
      comments,
      pagination,
      commentMapper,
    );
  }
}
