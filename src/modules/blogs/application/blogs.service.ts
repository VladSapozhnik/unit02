import { BlogType } from '../types/blog.type';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { DeleteResult, InsertOneResult, UpdateResult, WithId } from 'mongodb';
import { blogsRepository } from '../repositories/blogs.repository';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';

export const blogsService = {
  async createBlog(body: CreateBlogDto): Promise<WithId<BlogType>> {
    const newBlog: BlogType = {
      ...body,
      createdAt: createdAtHelper(),
      isMembership: false,
    };

    const result: InsertOneResult<BlogType> =
      await blogsRepository.createBlog(newBlog);

    if (!result.insertedId) {
      throw new BadRequestError('Failed to create blog', 'blog');
    }

    return {
      _id: result.insertedId,
      ...newBlog,
    };
  },

  async updateBlog(id: string, body: UpdateBlogDto): Promise<boolean> {
    const result: UpdateResult<BlogType> = await blogsRepository.updateBlog(
      id,
      body,
    );

    if (result.matchedCount === 0) {
      throw new NotFoundError('Id is not found', 'blog');
    }

    return result.matchedCount === 1;
  },

  async removeBlogById(id: string): Promise<boolean> {
    const result: DeleteResult = await blogsRepository.removeBlogById(id);

    if (result.deletedCount === 0) {
      throw new NotFoundError('Id is not found', 'blog');
    }

    return result.deletedCount === 1;
  },
};
