import { BlogType } from '../types/blog.type';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
// import { blogsRepository } from '../repositories/blogs.repository';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { BlogsRepository } from '../repositories/blogs.repository';
import { inject, injectable } from 'inversify';

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository)
    protected readonly blogsRepository: BlogsRepository,
  ) {}

  async createBlog(body: CreateBlogDto): Promise<string> {
    const newBlog: BlogType = {
      ...body,
      createdAt: createdAtHelper(),
      isMembership: false,
    };

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

// export const blogsService = {
//   async createBlog(body: CreateBlogDto): Promise<string> {
//     const newBlog: BlogType = {
//       ...body,
//       createdAt: createdAtHelper(),
//       isMembership: false,
//     };
//
//     const blogId: string = await blogsRepository.createBlog(newBlog);
//
//     if (!blogId) {
//       throw new BadRequestError('Failed to create blog', 'blog');
//     }
//
//     return blogId;
//   },
//
//   async updateBlog(id: string, body: UpdateBlogDto): Promise<boolean> {
//     const isUpdated: boolean = await blogsRepository.updateBlog(id, body);
//
//     if (!isUpdated) {
//       throw new NotFoundError('Id is not found', 'blog');
//     }
//
//     return isUpdated;
//   },
//
//   async removeBlogById(id: string): Promise<boolean> {
//     const isDeleted: boolean = await blogsRepository.removeBlogById(id);
//
//     if (!isDeleted) {
//       throw new NotFoundError('Id is not found', 'blog');
//     }
//
//     return isDeleted;
//   },
// };
