// import { Response } from 'express';
// import { RequestWithParam } from '../../../../core/types/request.type';
// import { IdPostParamDto } from '../../dto/id-post-param.dto';
// import { PostType } from '../../types/post.type';
// import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
// import { postsQueryRepository } from '../../repositories/posts.query.repository';
// import { NotFoundError } from '../../../../core/errors/repository-not-found.error';
//
// export const getPostByIdHandler = async (
//   req: RequestWithParam<IdPostParamDto>,
//   res: Response,
// ) => {
//   const existPost: PostType | null = await postsQueryRepository.getPostById(
//     req.params.id,
//   );
//
//   if (!existPost) {
//     throw new NotFoundError('Post is not found.', 'post');
//   }
//
//   res.send(existPost);
// };
