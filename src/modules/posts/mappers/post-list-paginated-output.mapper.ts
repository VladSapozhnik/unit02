import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { PostOutputType } from '../types/post-output.type';

export const postListPaginatedOutputMapper = (
  items: PostOutputType[],
  meta: PaginatedMetaType,
) => {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
};
