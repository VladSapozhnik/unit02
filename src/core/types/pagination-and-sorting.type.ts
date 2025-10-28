import { SortDirection } from '../enums/sort-direction.enum';

export type PaginationAndSorting<S> = {
  sortBy: S;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
