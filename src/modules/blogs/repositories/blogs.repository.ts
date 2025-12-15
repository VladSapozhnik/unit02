import { BlogDBType } from '../types/blog.type';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogsModel } from '../../../core/db/mango.db';
import { DeleteResult, UpdateResult, Types } from 'mongoose';
import { injectable } from 'inversify';

@injectable()
export class BlogsRepository {
  async getBlogById(id: string): Promise<BlogDBType | null> {
    const findBlog: BlogDBType | null = await BlogsModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!findBlog) {
      return null;
    }

    return findBlog;
  }

  async createBlog(body: BlogDBType): Promise<string> {
    const result: BlogDBType = await BlogsModel.create(body);

    return result._id.toString();
  }

  async updateBlog(id: string, body: UpdateBlogDto): Promise<boolean> {
    const result: UpdateResult = await BlogsModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: body },
    );

    return result.matchedCount === 1;
  }

  async removeBlogById(id: string): Promise<boolean> {
    const result: DeleteResult = await BlogsModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return result.deletedCount === 1;
  }
}
