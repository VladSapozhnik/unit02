import { BlogsService } from '../application/blogs.service';
import {
  RequestWithBody,
  RequestWithParam,
  RequestWithParamAndBody,
} from '../../../core/types/request.type';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { Request, Response } from 'express';
import { BlogType } from '../types/blog.type';
import { BlogsQueryRepository } from '../repositories/blogs.query.repository';
import { HTTP_STATUS } from '../../../core/enums/http-status.enum';
import { BlogQueryInput } from './input/blog-query.input';
import { matchedData } from 'express-validator';
import { PaginationAndSortingType } from '../../../core/types/pagination-and-sorting.type';
import { BlogSortFieldEnum } from '../enum/blog-sort-field.enum';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../core/helpers/set-default-sort-and-pagination.helper';
import { IdBlogParamDto } from '../dto/id-blog-param.dto';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { inject, injectable } from 'inversify';

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) private readonly blogsService: BlogsService,
    @inject(BlogsQueryRepository)
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async createBlog(req: RequestWithBody<CreateBlogDto>, res: Response) {
    const id: string = await this.blogsService.createBlog(req.body);

    const findCreatedBlog: BlogType | null =
      await this.blogsQueryRepository.getBlogById(id);

    res.status(HTTP_STATUS.CREATED_201).send(findCreatedBlog);
  }

  async getAllBlogs(req: Request, res: Response) {
    const sanitizedQuery: BlogQueryInput = matchedData<BlogQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const defaultQuery: PaginationAndSortingType<BlogSortFieldEnum> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const blogsOutput = await this.blogsQueryRepository.getBlogs(defaultQuery);

    res.send(blogsOutput);
  }

  async getBlogById(req: RequestWithParam<IdBlogParamDto>, res: Response) {
    const existBlog: BlogType | null =
      await this.blogsQueryRepository.getBlogById(req.params.id);

    if (!existBlog) {
      throw new NotFoundError('blog is not found', 'blog');
    }

    res.json(existBlog);
  }

  async removeBlog(req: RequestWithParam<IdBlogParamDto>, res: Response) {
    await this.blogsService.removeBlogById(req.params.id);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async updateBlog(
    req: RequestWithParamAndBody<IdBlogParamDto, UpdateBlogDto>,
    res: Response,
  ) {
    await this.blogsService.updateBlog(req.params.id, req.body);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}
