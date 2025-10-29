import { paginationAndSortingDefault } from '../validators/pagination-and-sorting.validation';
import { PaginationAndSorting } from '../types/pagination-and-sorting.type';

export function setDefaultSortAndPaginationIfNotExistHelper<P = string>(
  query: Partial<PaginationAndSorting<P>>,
): PaginationAndSorting<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}
