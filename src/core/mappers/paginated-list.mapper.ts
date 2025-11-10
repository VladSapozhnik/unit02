import { WithId } from 'mongodb';
import { PaginatedMetaType } from '../types/paginated-meta.type';

export const paginatedListMapper = <T>(
  items: WithId<T>[],
  meta: PaginatedMetaType,
  mapper: (item: WithId<T>) => T,
) => {
  const itemsMapper: T[] = items.map(mapper);
  return {
    pagesCount: meta.pagesCount,
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: itemsMapper,
  };
};
