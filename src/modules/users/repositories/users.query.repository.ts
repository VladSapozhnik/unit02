import { usersCollection } from '../../../core/db/mango.db';
import { ObjectId } from 'mongodb';
import { UserDbType } from '../type/user.type';
import { UserQueryInput } from '../routes/input/user-query.input';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { userMapper } from '../mappers/user.mapper';
import { paginatedListMapper } from '../../../core/mappers/paginated-list.mapper';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { buildUserFilter } from '../helpers/build-user-filter.helper';
import { profileMapper } from '../mappers/profile.mapper';
import { ProfileType } from '../type/profile.type';
import { UserOutputType } from '../type/user-output.type';
import { injectable } from 'inversify';

@injectable()
export class UsersQueryRepository {
  async getAllUsers(queryDto: UserQueryInput) {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);
    const filter: any = buildUserFilter(queryDto);

    const users: UserDbType[] = await usersCollection
      .find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection, _id: 1 })
      .skip(skip)
      .limit(queryDto.pageSize)
      .toArray();

    const totalCount: number = await usersCollection.countDocuments(filter);

    const pagination: PaginatedMetaType = buildPaginationHelper(
      totalCount,
      queryDto.pageNumber,
      queryDto.pageSize,
    );

    return paginatedListMapper<UserDbType, UserOutputType>(
      users,
      pagination,
      userMapper,
    );
  }

  async getUserById(id: ObjectId | string): Promise<UserOutputType | null> {
    const user: UserDbType | null = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return null;
    }

    return userMapper(user);
  }

  async getProfile(id: string): Promise<ProfileType | null> {
    const user: UserDbType | null = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return null;
    }

    return profileMapper(user);
  }
}
