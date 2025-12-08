// import { Response } from 'express';
// import { CreatePostDto } from '../../dto/create-post.dto';
// import { RequestWithBody } from '../../../../core/types/request.type';
// import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
// import { PostType } from '../../types/post.type';
// import { postsService } from '../../application/posts.service';
// import { postsQueryRepository } from '../../repositories/posts.query.repository';
//
// export const createPostHandler = async (
//   req: RequestWithBody<CreatePostDto>,
//   res: Response,
// ) => {
//   const id: string = await postsService.createPost(req.body);
//
//   const post: PostType | null = await postsQueryRepository.getPostById(id);
//
//   res.status(HTTP_STATUS.CREATED_201).send(post);
// };
