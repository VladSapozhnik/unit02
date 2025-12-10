import { BlogDBType } from '../types/blog.type';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { blogsCollection } from '../../../core/db/mango.db';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export class BlogsRepository {
  async getBlogById(id: ObjectId | string): Promise<BlogDBType | null> {
    const findBlog: BlogDBType | null = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!findBlog) {
      return null;
    }

    return findBlog;
  }

  async createBlog(body: BlogDBType): Promise<string> {
    const result: InsertOneResult<BlogDBType> =
      await blogsCollection.insertOne(body);

    return result?.insertedId.toString() ?? null;
  }

  async updateBlog(id: string, body: UpdateBlogDto): Promise<boolean> {
    const result: UpdateResult<BlogDBType> = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body },
    );

    return result.matchedCount === 1;
  }

  async removeBlogById(id: string): Promise<boolean> {
    const result: DeleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return result.deletedCount === 1;
  }
}
