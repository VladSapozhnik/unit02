import { PaginatedMetaType } from '../../../../core/types/paginated-meta.type';
import { PostType } from '../../types/post.type';
import { WithId } from 'mongodb';
import { postMapper } from './posts.mapper';
// import { PaginatedOutputType } from '../../../../core/types/paginated-output.type';

export const postListPaginatedOutputMapper = (
  posts: WithId<PostType>[],
  meta: PaginatedMetaType,
) => {
  const items: PostType[] = posts.map(postMapper);

  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
};
