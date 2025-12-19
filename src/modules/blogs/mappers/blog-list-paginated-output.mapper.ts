import { blogMapper } from './blog.mapper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { BlogOutputType } from '../types/blog-output.type';
import { BlogDocument } from '../types/blog.entity';

export const blogListPaginatedOutputMapper = (
  blogs: BlogDocument[],
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
