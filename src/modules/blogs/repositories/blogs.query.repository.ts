import { BlogType } from '../types/blog.type';
import { blogCollection } from '../../../core/db/mango.db';
import { ObjectId, WithId } from 'mongodb';
import { BlogQueryInput } from '../routes/input/blog-query.input';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { blogMapper } from '../mappers/blog.mapper';
import { buildBlogsFilter } from '../helpers/build-blogs-filter.helper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { paginatedListMapper } from '../../../core/mappers/paginated-list.mapper';

export const blogsQueryRepository = {
  async getBlogs(queryDto: BlogQueryInput) {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const filter: any = buildBlogsFilter(queryDto);

    const items: WithId<BlogType>[] = await blogCollection
      .find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(skip)
      .limit(queryDto.pageSize)
      .toArray();

    const totalCount: number = await blogCollection.countDocuments(filter);

    const pagination: PaginatedMetaType = buildPaginationHelper(
      totalCount,
      queryDto.pageNumber,
      queryDto.pageSize,
    );

    return paginatedListMapper(items, pagination, blogMapper);
  },

  async getBlogById(id: ObjectId | string): Promise<BlogType | null> {
    const findBlog: WithId<BlogType> | null = await blogCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!findBlog) {
      return null;
    }

    return blogMapper(findBlog);
  },
};
