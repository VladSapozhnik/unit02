import { WithId } from 'mongodb';
import { PaginatedMetaType } from '../types/paginated-meta.type';

export const paginatedListMapper = <T>(
  users: WithId<T>[],
  meta: PaginatedMetaType,
  mapper: (item: WithId<T>) => T,
) => {
  const items: T[] = users.map(mapper);
  return {
    pagesCount: meta.pagesCount,
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
};
