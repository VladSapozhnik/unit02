import { SortDirectionEnum } from '../enums/sort-direction.enum';

export type PaginationAndSortingType<S> = {
  sortBy: S;
  sortDirection: SortDirectionEnum;
  pageNumber: number;
  pageSize: number;
};
