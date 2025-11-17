import { BlogType } from '../types/blog.type';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { blogsCollection } from '../../../core/db/mango.db';
import {
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';

export const blogsRepository = {
  async createBlog(body: BlogType): Promise<string> {
    const result: InsertOneResult<WithId<BlogType>> =
      await blogsCollection.insertOne(body);

    return result?.insertedId.toString() ?? null;
  },

  async updateBlog(id: string, body: UpdateBlogDto): Promise<boolean> {
    const result: UpdateResult<BlogType> = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body },
    );

    return result.matchedCount === 1;
  },

  async removeBlogById(id: string): Promise<boolean> {
    const result: DeleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return result.deletedCount === 1;
  },
};
