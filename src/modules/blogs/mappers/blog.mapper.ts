import { BlogDBType } from '../types/blog.type';
import { ObjectId } from 'mongodb';
import { BlogOutputType } from '../types/blog-output.type';

export const blogMapper = (blog: BlogDBType): BlogOutputType => {
  return {
    id: new ObjectId(blog._id).toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
