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

  async updateBlog(
    id: string,
    body: UpdateBlogDto,
  ): Promise<UpdateResult<BlogType>> {
    return blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: body });
  },

  async removeBlogById(id: string): Promise<DeleteResult> {
    return await blogsCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
