import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { PostSortFieldEnum } from '../../enum/post-sort-field.enum';

export type PostQueryInput = PaginationAndSortingType<PostSortFieldEnum>;
