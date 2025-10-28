import { Request, Response } from 'express';
import { BlogType } from '../../types/blog.type';
import { WithId } from 'mongodb';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { blogMapper } from '../mappers/blog.mapper';
import { blogsService } from '../../application/blogs.service';
import { matchedData } from 'express-validator';
import { BlogQueryInput } from '../input/blog-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import { blogListPaginatedOutputMapper } from '../mappers/blog-list-paginated-output.mapper';

export const getAllBlogsController = async (req: Request, res: Response) => {
  try {
    const sanitizedQuery = matchedData<BlogQueryInput>(req, {
      locations: ['query'],
    });

    const defaultQuery = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await blogsService.getBlogs(defaultQuery);

    // const blogs: BlogType[] = blogsFromDb.map(blogMapper);
    const blogsOutput = blogListPaginatedOutputMapper(items, {
      page: defaultQuery.pageNumber,
      pageSize: defaultQuery.pageSize,
      totalCount,
    });

    res.send(blogsOutput);
  } catch (e) {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
