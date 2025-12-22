import { Types } from 'mongoose';
import { PostOutputType } from '../types/post-output.type';
import { PostsDocument } from '../entities/post.entity';

export const postMapper = (post: PostsDocument): PostOutputType => {
  return {
    id: new Types.ObjectId(post._id).toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
  };
};
