import { Request, Response } from 'express';
import { ResponsePostDto } from '../../dto/post/response-post.dto';
import { postsRepository } from '../../repository/posts.repository';

export const getAllPostsController = async (req: Request, res: Response) => {
  const findPosts: ResponsePostDto[] = postsRepository.getAllPosts();

  res.json(findPosts);
};
