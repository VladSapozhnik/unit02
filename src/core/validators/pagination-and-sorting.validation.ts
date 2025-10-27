import { SortDirection } from '../enums/sort-direction.enum';
import { query } from 'express-validator';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION: SortDirection = SortDirection.Desc;
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingValidation = [
  query('pageNumber')
    .optional()
    .default(DEFAULT_PAGE)
    .isInt({ min: 1 })
    .withMessage('Page number must be a positive integer')
    .toInt(),
  query('pageSize')
    .optional()
    .default(DEFAULT_PAGE_SIZE)
    .isInt({ min: 1, max: 100 })
    .withMessage('Page size must be between 1 and 100')
    .toInt(),
  query('sortDirection')
    .optional()
    .default(DEFAULT_SORT_DIRECTION)
    .isIn(Object.values(SortDirection))
    .withMessage(
      `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
    ),
];
