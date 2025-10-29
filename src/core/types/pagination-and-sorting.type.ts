import { SortDirection } from '../enums/sort-direction.enum';

export type PaginationAndSorting<S> = {
  sortBy: S;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
};
