import { SortDirection } from '../enums/sort-direction.enum';
import { query } from 'express-validator';
import { PaginationAndSorting } from '../types/pagination-and-sorting.type';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION: SortDirection = SortDirection.Desc;
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingDefault: PaginationAndSorting<string> = {
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
  pageNumber: DEFAULT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
};

export function paginationAndSortingValidation<T extends string>(
  sortFieldsEnum: Record<string, T>,
) {
  const allowedSortFields = Object.values(sortFieldsEnum);

  return [
    query('pageNumber')
      .default(DEFAULT_PAGE)
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(),
    query('pageSize')
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100')
      .toInt(),
    query('sortBy')
      .default(DEFAULT_SORT_BY)
      .isIn(Object.values(allowedSortFields))
      .withMessage(
        `Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`,
      ),
    query('sortDirection')
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(
        `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
      ),
  ];
}
