// import { Response } from 'express';
// import { RequestWithParamAndBody } from '../../../../core/types/request.type';
// import { IdBlogParamDto } from '../../dto/id-blog-param.dto';
// import { UpdateBlogDto } from '../../dto/update-blog.dto';
// import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
// import { blogsService } from '../../application/blogs.service';
//
// export const updateBlogHandler = async (
//   req: RequestWithParamAndBody<IdBlogParamDto, UpdateBlogDto>,
//   res: Response,
// ) => {
//   await blogsService.updateBlog(req.params.id, req.body);
//
//   res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
// };
