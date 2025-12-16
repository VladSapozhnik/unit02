import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
import { UserSortFieldEnum } from '../../enums/user-sort-field.enum';

export type UserQueryInput = PaginationAndSortingType<UserSortFieldEnum> &
  Partial<{ searchLoginTerm: string; searchEmailTerm: string }>;
