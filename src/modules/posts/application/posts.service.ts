import { PostType } from '../types/post.type';
import { CreatePostDto } from '../dto/create-post.dto';
import { BlogType } from '../../blogs/types/blog.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import { DeleteResult, UpdateResult } from 'mongodb';
import { postsRepository } from '../repositories/posts.repository';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { blogsQueryRepository } from '../../blogs/repositories/blogs.query.repository';
import { BadRequestError } from '../../../core/errors/bad-request.error';

export const postsService = {
  async createPost(body: CreatePostDto): Promise<string> {
    const existBlog: BlogType | null = await blogsQueryRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) {
      throw new BadRequestError("Blog doesn't exist", 'blogId For Post');
    }

    const postBody: PostType = {
      ...body,
      blogName: existBlog.name,
      createdAt: createdAtHelper(),
    };

    const postId: string = await postsRepository.createPost(postBody);

    if (!postId) {
      throw new BadRequestError('Failed to create Post', 'post');
    }

    return postId;
  },

  async createPostForBlog(body: CreatePostDto): Promise<string> {
    const existBlog: BlogType | null = await blogsQueryRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) {
      throw new NotFoundError('Blog not found for post', 'BlogId for Post');
    }

    const postBody: PostType = {
      ...body,
      blogName: existBlog.name,
      createdAt: createdAtHelper(),
    };

    const postId: string = await postsRepository.createPost(postBody);

    if (!postId) {
      throw new BadRequestError('Failed to create Post', 'post');
    }

    return postId;
  },

  async updatePost(id: string, body: UpdatePostDto): Promise<boolean> {
    const existBlog: BlogType | null = await blogsQueryRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) {
      throw new NotFoundError('BlogId not found for post', 'BlogId for Post');
    }

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
