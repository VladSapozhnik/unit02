import { PostType } from '../types/post.type';
import { CreatePostDto } from '../dto/create-post.dto';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { BlogType } from '../../blogs/types/blog.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../../core/db/mango.db';

export const postsRepository = {
  async getAllPosts(): Promise<WithId<PostType>[]> {
    return postCollection.find().toArray();
  },

  async createPost(body: CreatePostDto): Promise<WithId<PostType> | boolean> {
    const existBlog: BlogType | null = await blogsRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) {
      return false;
    }

    const postBody = {
      ...body,
      blogName: existBlog.name,
      createdAt: new Date().toISOString(),
    };

    const result: InsertOneResult<WithId<PostType>> =
      await postCollection.insertOne(postBody);

    return { _id: result.insertedId, ...postBody };
  },

  async getPostById(id: string): Promise<WithId<PostType> | null> {
    return await postCollection.findOne({ _id: new ObjectId(id) });
  },

  async updatePost(id: string, body: UpdatePostDto): Promise<boolean> {
    const existBlog: WithId<BlogType> | null =
      await blogsRepository.getBlogById(body.blogId);

    if (!existBlog) {
      return false;
    }

    const result = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, blogName: existBlog.name } },
    );

    return result.matchedCount === 1;
  },
  async removePost(id: string): Promise<boolean> {
    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },
};
