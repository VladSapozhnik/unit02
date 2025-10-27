import { Request, Response } from 'express';
import { PostType } from '../../types/post.type';
import { HTTP_STATUS } from '../../../../core/enums/http-status';
import { postMapper } from '../mappers/posts.mapper';
import { WithId } from 'mongodb';
import { postsService } from '../../application/posts.service';

export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const findPosts: WithId<PostType>[] = await postsService.getAllPosts();

    const posts: PostType[] = findPosts.map(postMapper);
    res.json(posts);
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
