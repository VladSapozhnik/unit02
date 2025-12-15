import { blogMapper } from './blog.mapper';
import { BlogDBType } from '../types/blog.type';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { BlogOutputType } from '../types/blog-output.type';

export const blogListPaginatedOutputMapper = (
  blogs: BlogDBType[],
  meta: PaginatedMetaType,
) => {
  const items: BlogOutputType[] = blogs.map(blogMapper);
  return {
    pagesCount: meta.pagesCount,
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
};
