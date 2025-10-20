import { Request, Response } from 'express';
import { PostType } from '../../types/post.type';
import { postsRepository } from '../../repository/posts.repository';

export const getAllPostsController = async (req: Request, res: Response) => {
  const findPosts: PostType[] = await postsRepository.getAllPosts();

  res.json(findPosts);
};
