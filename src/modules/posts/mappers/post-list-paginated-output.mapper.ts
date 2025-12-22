import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { postMapper } from './posts.mapper';
import { PostOutputType } from '../types/post-output.type';
import { PostsDocument } from '../entities/post.entity';

export const postListPaginatedOutputMapper = (
  posts: PostsDocument[],
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
