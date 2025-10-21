import { BlogType } from '../types/blog.type';
import { CreateBlogDto } from '../dto/blog/create-blog.dto';
import { UpdateBlogDto } from '../dto/blog/update-blog.dto';
import { blogCollection } from '../db/mango.db';
import { ObjectId, UpdateResult, WithId } from 'mongodb';

export const blogsRepository = {
  async getBlogs(): Promise<WithId<BlogType>[]> {
    return blogCollection.find().toArray();
  },

  async createBlog(body: CreateBlogDto): Promise<WithId<BlogType> | null> {
    const newBlog = {
      ...body,
      createdAt: new Date(),
      isMembership: false,
    };

    const result = await blogCollection.insertOne(newBlog);

    return { ...newBlog, _id: result.insertedId };
  },

  async getBlogById(id: string): Promise<WithId<BlogType> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async updateBlog(id: string, body: UpdateBlogDto): Promise<boolean> {
    const result: UpdateResult<BlogType> = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body },
    );

    return result.matchedCount === 1;
  },

  async removeBlogById(id: string): Promise<boolean> {
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },
};
