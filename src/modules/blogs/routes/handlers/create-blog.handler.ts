// import { Response } from 'express';
// import { RequestWithBody } from '../../../../core/types/request.type';
// import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
// import { CreateBlogDto } from '../../dto/create-blog.dto';
// import { BlogType } from '../../types/blog.type';
//
// export const createBlogHandler = async (
//   req: RequestWithBody<CreateBlogDto>,
//   res: Response,
// ) => {
//   const id: string = await blogsService.createBlog(req.body);
//
//   const findCreatedBlog: BlogType | null =
//     await blogsQueryRepository.getBlogById(id);
//
//   res.status(HTTP_STATUS.CREATED_201).send(findCreatedBlog);
// };
