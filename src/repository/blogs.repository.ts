import { BlogType } from '../types/blog.type';
import { CreateBlogDto } from '../dto/blog/create-blog.dto';
import { UpdateBlogDto } from '../dto/blog/update-blog.dto';
import { blogCollection } from '../db/mango.db';
import { UpdateResult, WithId } from 'mongodb';
import { generateId } from '../constants/generate-id';

export const blogsRepository = {
  async getBlogs(): Promise<WithId<BlogType>[]> {
    return blogCollection.find().toArray();
  },

  async createBlog(body: CreateBlogDto): Promise<WithId<BlogType> | null> {
    const id = generateId();
    const newBlog = {
      _id: id,
      ...body,
      createdAt: new Date(),
      isMembership: false,
    };

    await blogCollection.insertOne(newBlog);

    return { ...newBlog };
  },

  async getBlogById(id: string): Promise<WithId<BlogType> | null> {
    return blogCollection.findOne({ _id: id });
  },

  async updateBlog(id: string, body: UpdateBlogDto): Promise<boolean> {
    const result: UpdateResult<BlogType> = await blogCollection.updateOne(
      { _id: id },
      { $set: body },
    );

    return result.matchedCount === 1;
  },

  async removeBlogById(id: string): Promise<boolean> {
    const result = await blogCollection.deleteOne({ _id: id });

    return result.deletedCount === 1;
  },
};
