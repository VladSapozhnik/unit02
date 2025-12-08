// import { Response } from 'express';
// import { RequestWithParamAndBody } from '../../../../core/types/request.type';
// import { IdPostParamDto } from '../../dto/id-post-param.dto';
// import { UpdatePostDto } from '../../dto/update-post.dto';
// import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
// import { postsService } from '../../application/posts.service';
//
// export const updatePostHandler = async (
//   req: RequestWithParamAndBody<IdPostParamDto, UpdatePostDto>,
//   res: Response,
// ) => {
//   await postsService.updatePost(req.params.id, req.body);
//
//   res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
// };
