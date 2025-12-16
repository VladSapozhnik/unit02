import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { BlogSortFieldEnum } from '../../enums/blog-sort-field.enum';

export type BlogQueryInput = PaginationAndSortingType<BlogSortFieldEnum> &
  Partial<{ searchNameTerm: string }>;
