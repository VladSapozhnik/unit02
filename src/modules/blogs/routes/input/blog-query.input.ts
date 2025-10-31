import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { BlogSortFieldEnum } from '../../enum/blog-sort-field.enum';

export type BlogQueryInput = PaginationAndSortingType<BlogSortFieldEnum> &
  Partial<{ searchNameTerm: string }>;
