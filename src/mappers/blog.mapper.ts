import { BlogType } from '../types/blog.type';
import { ObjectId, WithId } from 'mongodb';

export const blogMapper = (blog: WithId<BlogType>): BlogType => {
  return {
    id: new ObjectId(blog._id).toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
