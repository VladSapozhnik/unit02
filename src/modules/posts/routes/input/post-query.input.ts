import { PaginationAndSorting } from '../../../../core/types/pagination-and-sorting.type';
import { PostSortField } from './post-sort-field';

export type PostQueryInput = PaginationAndSorting<PostSortField>;
