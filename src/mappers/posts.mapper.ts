import { ObjectId, WithId } from 'mongodb';
import { PostType } from '../types/post.type';

export const postMapper = (post: WithId<PostType>): PostType => {
  return {
    id: new ObjectId(post._id).toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
