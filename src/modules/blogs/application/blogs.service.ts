import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { BlogsRepository } from '../repositories/blogs.repository';
import { inject, injectable } from 'inversify';
import { BlogDocument, BlogModel } from '../types/blog.entity';

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository)
    protected readonly blogsRepository: BlogsRepository,
  ) {}

  async createBlog(body: CreateBlogDto): Promise<string> {
    const newBlog = new BlogModel({
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      isMembership: false,
    });

    const blogId: string = await this.blogsRepository.createBlog(newBlog);

    if (!blogId) {
      throw new BadRequestError('Failed to create blog', 'blog');
    }

    return blogId;
  }

  async updateBlog(id: string, body: UpdateBlogDto) {
    const isBlog: BlogDocument | null =
      await this.blogsRepository.getBlogById(id);

    if (!isBlog) {
      throw new NotFoundError('Id is not found', 'blog');
    }

    isBlog.name = body.name;
    isBlog.description = body.description;
    isBlog.websiteUrl = body.websiteUrl;

    await this.blogsRepository.updateBlog(isBlog);
  }

  async removeBlogById(id: string) {
    const isBlog: BlogDocument | null =
      await this.blogsRepository.getBlogById(id);

    if (!isBlog) {
      throw new NotFoundError('Id is not found', 'blog');
    }

    await this.blogsRepository.removeBlogById(isBlog);
  }
}
