import { PostType } from '../types/post.type';
import { CreatePostDto } from '../dto/post/create-post.dto';
import { blogsRepository } from './blogs.repository';
import { BlogType } from '../types/blog.type';
import { UpdatePostDto } from '../dto/post/update-post.dto';
import { WithId } from 'mongodb';
import { postCollection } from '../db/mango.db';
import { generateId } from '../constants/generate-id';

export const postsRepository = {
  async getAllPosts(): Promise<WithId<PostType>[]> {
    return postCollection.find().toArray();
  },

  async createPost(body: CreatePostDto) {
    const id = generateId();

    const existBlog: WithId<BlogType> | null =
      await blogsRepository.getBlogById(body.blogId);

    if (!existBlog) {
      return false;
    }

    const postBody = {
      _id: id,
      ...body,
      blogName: existBlog.name,
      createdAt: new Date(),
    };

    await postCollection.insertOne(postBody);

    return postBody;
  },

  async getPostById(id: string): Promise<WithId<PostType> | null> {
    return await postCollection.findOne({ _id: id });
  },

  async updatePost(id: string, body: UpdatePostDto): Promise<boolean> {
    const existBlog: WithId<BlogType> | null =
      await blogsRepository.getBlogById(body.blogId);

    if (!existBlog) {
      return false;
    }

    const result = await postCollection.updateOne(
      { _id: id },
      { $set: { ...body, blogName: existBlog.name } },
    );

    return result.matchedCount === 1;
  },
  async removePost(id: string): Promise<boolean> {
    const result = await postCollection.deleteOne({ _id: id });

    return result.deletedCount === 1;
  },
};
