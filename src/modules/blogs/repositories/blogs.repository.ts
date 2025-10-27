import { BlogType } from '../types/blog.type';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { blogCollection } from '../../../core/db/mango.db';
import {
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';

export const blogsRepository = {
  async getBlogs(): Promise<WithId<BlogType>[]> {
    return blogCollection.find().toArray();
  },

  async createBlog(body: BlogType): Promise<InsertOneResult<BlogType>> {
    return blogCollection.insertOne(body);
  },

  async getBlogById(id: string): Promise<WithId<BlogType> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async updateBlog(
    id: string,
    body: UpdateBlogDto,
  ): Promise<UpdateResult<BlogType>> {
    return blogCollection.updateOne({ _id: new ObjectId(id) }, { $set: body });
  },

  async removeBlogById(id: string): Promise<DeleteResult> {
    return await blogCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
