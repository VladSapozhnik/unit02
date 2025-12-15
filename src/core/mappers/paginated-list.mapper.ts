import { PaginatedMetaType } from '../types/paginated-meta.type';

export const paginatedListMapper = <T, T2 = T>(
  items: T[],
  meta: PaginatedMetaType,
  mapper: (item: T) => T2,
) => {
  const itemsMapper: T2[] = items.map(mapper);
  return {
    pagesCount: meta.pagesCount,
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: itemsMapper,
  };
};
