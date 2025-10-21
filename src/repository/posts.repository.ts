import { PostType } from '../types/post.type';
import { CreatePostDto } from '../dto/post/create-post.dto';
import { blogsRepository } from './blogs.repository';
import { BlogType } from '../types/blog.type';
import { UpdatePostDto } from '../dto/post/update-post.dto';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { postCollection } from '../db/mango.db';

export const postsRepository = {
  async getAllPosts(): Promise<WithId<PostType>[]> {
    return postCollection.find().toArray();
  },

  async createPost(body: CreatePostDto) {
    const existBlog: WithId<BlogType> | null =
      await blogsRepository.getBlogById(body.blogId);

    if (!existBlog) {
      throw new Error('Post not existing');
    }

    const result: InsertOneResult<WithId<PostType>> =
      await postCollection.insertOne({
        ...body,
        blogName: existBlog.name,
        createdAt: new Date(),
      });

    return { _id: result.insertedId, ...body, blogName: existBlog.name };
  },

  async getPostById(id: string): Promise<WithId<PostType> | null> {
    return await postCollection.findOne({ _id: new ObjectId(id) });
  },

  async updatePost(id: string, body: UpdatePostDto): Promise<boolean> {
    const existBlog: WithId<BlogType> | null =
      await blogsRepository.getBlogById(body.blogId);

    if (!existBlog) {
      throw new Error('Blog not existing');
    }

    const result = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { ...body, blogName: existBlog.name },
    );

    return result.matchedCount === 1;
  },
  async removePost(id: string): Promise<boolean> {
    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },
};
