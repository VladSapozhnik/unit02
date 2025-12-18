import { BlogDBType } from '../types/blog.type';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { BlogsRepository } from '../repositories/blogs.repository';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository)
    protected readonly blogsRepository: BlogsRepository,
  ) {}

  async createBlog(body: CreateBlogDto): Promise<string> {
    const newBlog: BlogDBType = new BlogDBType(
      new Types.ObjectId(),
      body.name,
      body.description,
      body.websiteUrl,
      new Date(),
      false,
    );

    const blogId: string = await this.blogsRepository.createBlog(newBlog);

    if (!blogId) {
      throw new BadRequestError('Failed to create blog', 'blog');
    }

    return blogId;
  }

  async updateBlog(id: string, body: UpdateBlogDto): Promise<boolean> {
    const isUpdated: boolean = await this.blogsRepository.updateBlog(id, body);

    if (!isUpdated) {
      throw new NotFoundError('Id is not found', 'blog');
    }

    return isUpdated;
  }

  async removeBlogById(id: string): Promise<boolean> {
    const isDeleted: boolean = await this.blogsRepository.removeBlogById(id);

    if (!isDeleted) {
      throw new NotFoundError('Id is not found', 'blog');
    }

    return isDeleted;
  }
}
