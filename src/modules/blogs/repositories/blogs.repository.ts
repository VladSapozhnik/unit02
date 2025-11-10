import { BlogType } from '../types/blog.type';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { blogsCollection } from '../../../core/db/mango.db';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';

export const blogsRepository = {
  async createBlog(body: BlogType): Promise<InsertOneResult<BlogType>> {
    return blogsCollection.insertOne(body);
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
