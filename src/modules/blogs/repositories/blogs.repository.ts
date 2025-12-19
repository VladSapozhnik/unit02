import { Types } from 'mongoose';
import { injectable } from 'inversify';
import { BlogDocument, BlogModel } from '../types/blog.entity';

@injectable()
export class BlogsRepository {
  async getBlogById(id: string): Promise<BlogDocument | null> {
    const findBlog: BlogDocument | null = await BlogModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!findBlog) {
      return null;
    }

    return findBlog;
  }

  async createBlog(newBlog: BlogDocument): Promise<string> {
    // const result: BlogDocument = await BlogModel.create(body);
    const result: BlogDocument = await newBlog.save();
    return result._id.toString();
  }

  async updateBlog(isBlog: BlogDocument): Promise<string> {
    const result: BlogDocument = await isBlog.save();

    return result._id.toString();
  }

  async removeBlogById(blog: BlogDocument): Promise<string> {
    await blog.deleteOne();

    return blog._id.toString();
  }
}
