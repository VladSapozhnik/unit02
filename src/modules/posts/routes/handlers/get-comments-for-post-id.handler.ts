import { Request, Response } from 'express';
import { commentsQueryRepository } from '../../../comments/repositories/comments.query.repository';
import { postsRepository } from '../../repositories/posts.repository';
import { WithId } from 'mongodb';
import { PostType } from '../../types/post.type';
import { NotFoundError } from '../../../../core/errors/repository-not-found.error';
import { matchedData } from 'express-validator';
import { CommentQueryInput } from '../../../comments/routes/input/comment-query.input';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { CommentSortFieldEnum } from '../../../comments/enum/comment-sort-field.enum';

export const getCommentsForPostIdHandler = async (
  req: Request,
  res: Response,
) => {
  const sanitizedQuery: CommentQueryInput = matchedData<CommentQueryInput>(
    req,
    { locations: ['query'] },
  );

  const defaultQuery: PaginationAndSortingType<CommentSortFieldEnum> =
    setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

  const isPost: WithId<PostType> | null = await postsRepository.findPostById(
    req.params.postId,
  );

  if (!isPost) {
    throw new NotFoundError(`Post with id ${req.params.id} not found`, 'post');
  }

  const findPost = await commentsQueryRepository.getCommentsByPostId(
    defaultQuery,
    isPost._id,
  );

  res.send(findPost);
};
