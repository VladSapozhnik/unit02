import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { CommentSortFieldEnum } from '../../enum/comment-sort-field.enum';

export type CommentQueryInput = PaginationAndSortingType<CommentSortFieldEnum>;
