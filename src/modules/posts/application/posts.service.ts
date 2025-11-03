import { PostType } from '../types/post.type';
import { CreatePostDto } from '../dto/create-post.dto';
import { BlogType } from '../../blogs/types/blog.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import { DeleteResult, InsertOneResult, UpdateResult, WithId } from 'mongodb';
import { postsRepository } from '../repositories/posts.repository';
import { PostQueryInput } from '../routes/input/post-query.input';
import { ItemsAndTotalCountType } from '../../../core/types/items-and-total-count.type';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { blogsQueryRepository } from '../../blogs/repositories/blogs.query.repository';
import { postsQueryRepository } from '../repositories/posts.query.repository';

export const postsService = {
  async createPost(body: CreatePostDto): Promise<WithId<PostType> | boolean> {
    const existBlog: BlogType | null = await blogsQueryRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) return false;

    const postBody = {
      ...body,
      blogName: existBlog.name,
      // createdAt: new Date().toISOString(),
      createdAt: createdAtHelper,
    };

    const result: InsertOneResult<WithId<PostType>> =
      await postsRepository.createPost(postBody);

    if (!result.insertedId) return false;

    return { _id: result.insertedId, ...postBody };
  },

  async createPostForBlog(
    body: CreatePostDto,
  ): Promise<WithId<PostType> | boolean> {
    const existBlog: BlogType | null = await blogsQueryRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) {
      throw new NotFoundError('Blog not found');
    }

    const postBody = {
      ...body,
      blogName: existBlog.name,
      createdAt: new Date().toISOString(),
    };

    const result: InsertOneResult<WithId<PostType>> =
      await postsRepository.createPost(postBody);

    if (!result.insertedId) return false;

    return { _id: result.insertedId, ...postBody };
  },

  async getPostsByBlogId(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<ItemsAndTotalCountType<WithId<PostType>>> {
    const existBlog: BlogType | null =
      await blogsQueryRepository.getBlogById(blogId);

    if (!existBlog) {
      throw new NotFoundError('Blog not found');
    }

    return postsQueryRepository.getPostsByBlogId(blogId, queryDto);
  },

  async updatePost(id: string, body: UpdatePostDto): Promise<boolean> {
    const existBlog: WithId<BlogType> | null =
      await blogsQueryRepository.getBlogById(body.blogId);

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
