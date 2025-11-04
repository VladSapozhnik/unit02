import { userCollection } from '../../../core/db/mango.db';
import { ObjectId, WithId } from 'mongodb';
import { UserType } from '../type/user.type';
import { UserQueryInput } from '../routes/input/user-query.input';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { userMapper } from '../routes/mappers/user.mapper';
import { paginatedListMapper } from '../../../core/mappers/paginated-list.mapper';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { buildUserFilter } from '../helpers/build-user-filter.helper';

export const usersQueryRepository = {
  async getAllUsers(queryDto: UserQueryInput) {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);
    const filter: any = buildUserFilter(queryDto);

    const users: WithId<UserType>[] = await userCollection
      .find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection, _id: 1 })
      .skip(skip)
      .limit(queryDto.pageSize)
      .toArray();

    const totalCount: number = await userCollection.countDocuments(filter);

    const pagination: PaginatedMetaType = buildPaginationHelper(
      totalCount,
      queryDto.pageNumber,
      queryDto.pageSize,
    );

    return paginatedListMapper<UserType>(users, pagination, userMapper);
  },
  async getUserById(id: ObjectId): Promise<UserType | null> {
    const user: WithId<UserType> | null = await userCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return null;
    }

    return userMapper(user);
  },

  async getUserByLogin(login: string) {
    await userCollection.findOne({ login });
  },
  async getUserByEmail(email: string) {
    await userCollection.findOne({ email });
  },
};
