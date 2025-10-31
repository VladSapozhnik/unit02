import { paginationAndSortingDefault } from '../validators/pagination-and-sorting.validation';
import { PaginationAndSortingType } from '../types/pagination-and-sorting.type';

export function setDefaultSortAndPaginationIfNotExistHelper<P = string>(
  query: Partial<PaginationAndSortingType<P>>,
): PaginationAndSortingType<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}
