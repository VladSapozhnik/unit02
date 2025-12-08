// import { Request, Response } from 'express';
// import { matchedData } from 'express-validator';
// import { PostQueryInput } from '../input/post-query.input';
// import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
// import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
// import { PostSortFieldEnum } from '../../enum/post-sort-field.enum';
// import { errorsHandler } from '../../../../core/errors/errors.handler';
// import { postsQueryRepository } from '../../repositories/posts.query.repository';
//
// export const getAllPostsHandler = async (req: Request, res: Response) => {
//   try {
//     const sanitizedQuery: PostQueryInput = matchedData<PostQueryInput>(req, {
//       locations: ['query'],
//     });
//
//     const defaultQuery: PaginationAndSortingType<PostSortFieldEnum> =
//       setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);
//
//     const postsOutput = await postsQueryRepository.getPosts(defaultQuery);
//
//     res.json(postsOutput);
//   } catch (e) {
//     errorsHandler(e, res);
//   }
// };
