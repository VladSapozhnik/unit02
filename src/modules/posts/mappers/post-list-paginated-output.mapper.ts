import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { PostDBType } from '../types/post.type';
import { postMapper } from './posts.mapper';
import { PostOutputType } from '../types/post-output.type';

export const postListPaginatedOutputMapper = (
  posts: PostDBType[],
  meta: PaginatedMetaType,
) => {
  const items: PostOutputType[] = posts.map(postMapper);

  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
};
