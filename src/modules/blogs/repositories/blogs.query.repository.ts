import { BlogDBType } from '../types/blog.type';
import { BlogsModel } from '../../../core/db/mango.db';
import { Types } from 'mongoose';
import { BlogQueryInput } from '../routes/input/blog-query.input';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { blogMapper } from '../mappers/blog.mapper';
import { buildBlogsFilter } from '../helpers/build-blogs-filter.helper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { paginatedListMapper } from '../../../core/mappers/paginated-list.mapper';
import { injectable } from 'inversify';
import { BlogOutputType } from '../types/blog-output.type';

@injectable()
export class BlogsQueryRepository {
  async getBlogs(queryDto: BlogQueryInput) {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const filter: any = buildBlogsFilter(queryDto);

    const items: BlogDBType[] = await BlogsModel.find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(skip)
      .limit(queryDto.pageSize)
      .lean();

    const totalCount: number = await BlogsModel.countDocuments(filter);

    const pagination: PaginatedMetaType = buildPaginationHelper(
      totalCount,
      queryDto.pageNumber,
      queryDto.pageSize,
    );

    return paginatedListMapper(items, pagination, blogMapper);
  }

  async getBlogById(id: string): Promise<BlogOutputType | null> {
    const findBlog: BlogDBType | null = await BlogsModel.findOne({
      _id: new Types.ObjectId(id),
    }).lean();

    if (!findBlog) {
      return null;
    }

    return blogMapper(findBlog);
  }
}
