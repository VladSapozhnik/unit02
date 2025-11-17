import { WithId } from 'mongodb';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { UserType } from '../type/user.type';
import { userMapper } from './user.mapper';
import { UserOutputType } from '../type/user-output.type';

export const userListPaginatedOutputMapper = (
  users: WithId<UserType>[],
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
