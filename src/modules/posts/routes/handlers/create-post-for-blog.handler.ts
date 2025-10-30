import { Response } from 'express';
import { WithId } from 'mongodb';
import { PostType } from '../../types/post.type';
import { postsService } from '../../application/posts.service';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { postMapper } from '../mappers/posts.mapper';
import { RequestWithParamAndBody } from '../../../../core/types/request.type';
import { CreatePostForBlogDto } from '../../dto/create-post.dto';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { BlogIdQueryDto } from '../../dto/blogId-query.dto';

export const createPostForBlogHandler = async (
  req: RequestWithParamAndBody<BlogIdQueryDto, CreatePostForBlogDto>,
  res: Response,
) => {
  try {
    const blogId: string = req.params.blogId;

    const isCreatedPost: boolean | WithId<PostType> =
      await postsService.createPostForBlog({ ...req.body, blogId });

    if (!isCreatedPost) return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);

    res
      .status(HTTP_STATUS.CREATED_201)
      .send(postMapper(isCreatedPost as WithId<PostType>));
  } catch (e) {
    errorsHandler(e, res);
  }
};
