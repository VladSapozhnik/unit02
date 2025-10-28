import { blogMapper } from './blog.mapper';
import { BlogType } from '../../types/blog.type';
import { WithId } from 'mongodb';

type metaType = {
  pagesCount?: number;
  page: number;
  totalCount: number;
  pageSize: number;
};

export const blogListPaginatedOutputMapper = (
  blogs: WithId<BlogType>[],
  meta: metaType,
) => {
  const items: BlogType[] = blogs.map(blogMapper);
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
};
