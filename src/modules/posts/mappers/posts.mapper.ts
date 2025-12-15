import { Types } from 'mongoose';
import { PostDBType } from '../types/post.type';
import { PostOutputType } from '../types/post-output.type';

export const postMapper = (post: PostDBType): PostOutputType => {
  return {
    id: new Types.ObjectId(post._id).toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
