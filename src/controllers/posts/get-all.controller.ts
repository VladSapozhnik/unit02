import { Request, Response } from 'express';
import { PostType } from '../../types/post.type';
import { postsRepository } from '../../repository/posts.repository';
import { HTTP_STATUS } from '../../enums/http-status';

export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const findPosts: PostType[] = await postsRepository.getAllPosts();

    res.json(findPosts);
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
