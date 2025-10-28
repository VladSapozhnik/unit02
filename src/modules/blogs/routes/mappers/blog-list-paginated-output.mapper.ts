import { blogMapper } from './blog.mapper';
import { BlogType } from '../../types/blog.type';
import { WithId } from 'mongodb';
import { PaginatedOutputType } from '../../../../core/types/paginated-output.type';

export const blogListPaginatedOutputMapper = (
  blogs: WithId<BlogType>[],
  meta: PaginatedOutputType,
): PaginatedOutputType & { items: BlogType[] } => {
  const items: BlogType[] = blogs.map(blogMapper);
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
};
