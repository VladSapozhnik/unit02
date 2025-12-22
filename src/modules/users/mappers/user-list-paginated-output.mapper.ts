import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { userMapper } from './user.mapper';
import { UserOutputType } from '../type/user-output.type';
import { UsersDocument } from '../entities/user.entity';

export const userListPaginatedOutputMapper = (
  users: UsersDocument[],
  meta: PaginatedMetaType,
) => {
  const items: UserOutputType[] = users.map(userMapper);
  return {
    pagesCount: meta.pagesCount,
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items,
  };
};
