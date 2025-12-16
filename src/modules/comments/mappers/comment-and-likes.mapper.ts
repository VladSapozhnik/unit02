import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';

export const CommentAndLikesMapper = <T>(
  meta: PaginatedMetaType,
  items: T[],
) => {
  return {
    pagesCount: meta.pagesCount,
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
};
