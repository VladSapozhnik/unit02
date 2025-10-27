import { PostType } from '../types/post.type';
import { CreatePostDto } from '../dto/create-post.dto';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { BlogType } from '../../blogs/types/blog.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import { DeleteResult, InsertOneResult, UpdateResult, WithId } from 'mongodb';
import { postsRepository } from '../repositories/posts.repository';

export const postsService = {
  async getAllPosts(): Promise<WithId<PostType>[]> {
    return postsRepository.getAllPosts();
  },

  async createPost(body: CreatePostDto): Promise<WithId<PostType> | boolean> {
    const existBlog: BlogType | null = await blogsRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) return false;

    const postBody = {
      ...body,
      blogName: existBlog?.name,
      createdAt: new Date().toISOString(),
    };

    const result: InsertOneResult<WithId<PostType>> =
      await postsRepository.createPost(postBody);

    if (!result.insertedId) return false;

    return { _id: result.insertedId, ...postBody };
  },

  async getPostById(id: string): Promise<WithId<PostType> | null> {
    return postsRepository.getPostById(id);
  },

  async updatePost(id: string, body: UpdatePostDto): Promise<boolean> {
    const existBlog: WithId<BlogType> | null =
      await blogsRepository.getBlogById(body.blogId);

    if (!existBlog) return false;

    const updatedBody = { ...body, blogName: existBlog.name };

    const result: UpdateResult<PostType> = await postsRepository.updatePost(
      id,
      updatedBody,
    );

    return result.matchedCount === 1;
  },

  async removePost(id: string): Promise<boolean> {
    const result: DeleteResult = await postsRepository.removePost(id);

    return result.deletedCount === 1;
  },
};
