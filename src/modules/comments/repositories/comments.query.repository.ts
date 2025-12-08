import { ObjectId, WithId } from 'mongodb';
import { commentsCollection } from '../../../core/db/mango.db';
import { CommentType } from '../types/comment.type';
import { commentMapper } from '../mappers/comment.mapper';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { CommentQueryInput } from '../routes/input/comment-query.input';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { paginatedListMapper } from '../../../core/mappers/paginated-list.mapper';
import { injectable } from 'inversify';

@injectable()
export class CommentsQueryRepository {
  async getCommentById(id: string | ObjectId): Promise<CommentType | null> {
    const comment: WithId<CommentType> | null =
      await commentsCollection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return null;
    }

    return commentMapper(comment);
  }

  async getCommentsByPostId(queryDto: CommentQueryInput, postId: ObjectId) {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const comments: WithId<CommentType>[] = await commentsCollection
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
    return paginatedListMapper<CommentType>(
      comments,
      pagination,
      commentMapper,
    );
  }
}

// export const commentsQueryRepository = {
//   async getCommentById(id: string | ObjectId): Promise<CommentType | null> {
//     const comment: WithId<CommentType> | null =
//       await commentsCollection.findOne({ _id: new ObjectId(id) });
//
//     if (!comment) {
//       return null;
//     }
//
//     return commentMapper(comment);
//   },
//   async getCommentsByPostId(queryDto: CommentQueryInput, postId: ObjectId) {
//     const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);
//
//     const comments: WithId<CommentType>[] = await commentsCollection
//       .find({ postId: new ObjectId(postId) })
//       .sort({ [queryDto.sortBy]: queryDto.sortDirection })
//       .skip(skip)
//       .limit(queryDto.pageSize)
//       .toArray();
//
//     const totalCount: number = await commentsCollection.countDocuments({
//       postId: new ObjectId(postId),
//     });
//
//     const pagination: PaginatedMetaType = buildPaginationHelper(
//       totalCount,
//       queryDto.pageNumber,
//       queryDto.pageSize,
//     );
//     return paginatedListMapper<CommentType>(
//       comments,
//       pagination,
//       commentMapper,
//     );
//   },
// };
