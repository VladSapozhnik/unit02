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
import { BadRequestError } from '../../../core/errors/bad-request.error';

export const postsService = {
  async createPost(body: CreatePostDto): Promise<WithId<PostType>> {
    const existBlog: BlogType | null = await blogsQueryRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) {
      throw new BadRequestError("Blog doesn't exist", 'blogId For Post');
    }

    const postBody = {
      ...body,
      blogName: existBlog.name,
      createdAt: createdAtHelper(),
    };

    const result: InsertOneResult<WithId<PostType>> =
      await postsRepository.createPost(postBody);

    if (!result.insertedId) {
      throw new BadRequestError('Failed to create Post', 'post');
    }

    return { _id: result.insertedId, ...postBody };
  },

  async createPostForBlog(body: CreatePostDto): Promise<WithId<PostType>> {
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

    const result: InsertOneResult<WithId<PostType>> =
      await postsRepository.createPost(postBody);

    if (!result.insertedId) {
      throw new BadRequestError('Failed to create Post', 'post');
    }

    return { _id: result.insertedId, ...postBody };
  },

  async getPostsByBlogId(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<ItemsAndTotalCountType<WithId<PostType>>> {
    const existBlog: BlogType | null =
      await blogsQueryRepository.getBlogById(blogId);

    if (!existBlog) {
      throw new NotFoundError('Blog not found for post', 'BlogId for Post');
    }

    return postsQueryRepository.getPostsByBlogId(blogId, queryDto);
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

    if (result.matchedCount === 0) {
      throw new NotFoundError('Failed to update Post', 'post');
    }

    return result.matchedCount === 1;
  },

  async removePost(id: string): Promise<boolean> {
    const result: DeleteResult = await postsRepository.removePost(id);

    if (result.deletedCount === 0) {
      throw new NotFoundError('Failed to remove Post', 'post');
    }

    return result.deletedCount === 1;
  },
};
