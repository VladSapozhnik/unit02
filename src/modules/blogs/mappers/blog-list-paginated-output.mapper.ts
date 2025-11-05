import { blogMapper } from './blog.mapper';
import { BlogType } from '../types/blog.type';
import { WithId } from 'mongodb';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';

export const blogListPaginatedOutputMapper = (
  blogs: WithId<BlogType>[],
  meta: PaginatedMetaType,
) => {
  const items: BlogType[] = blogs.map(blogMapper);
  return {
    pagesCount: meta.pagesCount,
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
};
