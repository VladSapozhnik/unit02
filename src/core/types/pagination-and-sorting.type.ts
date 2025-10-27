import { SortDirection } from '../enums/sort-direction.enum';

export type PaginationAndSorting = {
  searchNameTerm: string;
  sortBy: string; ///&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
