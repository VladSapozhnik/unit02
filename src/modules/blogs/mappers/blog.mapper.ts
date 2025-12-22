import { Types } from 'mongoose';
import { BlogOutputType } from '../types/blog-output.type';
import { BlogDocument } from '../entities/blog.entity';

export const blogMapper = (blog: BlogDocument): BlogOutputType => {
  return {
    id: new Types.ObjectId(blog._id).toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
  };
};
