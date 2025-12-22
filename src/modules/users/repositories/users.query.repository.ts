import { Types } from 'mongoose';
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
import { UsersDocument, UsersModel } from '../entities/user.entity';

@injectable()
export class UsersQueryRepository {
  async getAllUsers(queryDto: UserQueryInput) {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);
    const filter: any = buildUserFilter(queryDto);

    const users: UsersDocument[] = await UsersModel.find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection, _id: 1 })
      .skip(skip)
      .limit(queryDto.pageSize);

    const totalCount: number = await UsersModel.countDocuments(filter);

    const pagination: PaginatedMetaType = buildPaginationHelper(
      totalCount,
      queryDto.pageNumber,
      queryDto.pageSize,
    );

    return paginatedListMapper<UsersDocument, UserOutputType>(
      users,
      pagination,
      userMapper,
    );
  }

  async getUserById(id: string): Promise<UserOutputType | null> {
    const user: UsersDocument | null = await UsersModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!user) {
      return null;
    }

    return userMapper(user);
  }

  async getProfile(id: string): Promise<ProfileType | null> {
    const user: UsersDocument | null = await UsersModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!user) {
      return null;
    }

    return profileMapper(user);
  }
}
