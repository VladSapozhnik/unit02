import { userCollection } from '../../../core/db/mango.db';
import { WithId } from 'mongodb';
import { UserType } from '../type/user.type';
import { UserQueryInput } from '../routes/input/user-query.input';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { ItemsAndTotalCountType } from '../../../core/types/items-and-total-count.type';

export const usersQueryRepository = {
  async getAllUsers(
    queryDto: UserQueryInput,
  ): Promise<ItemsAndTotalCountType<WithId<UserType>>> {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);
    const filter: any = {};

    if (queryDto.searchEmailTerm) {
      filter.email = { $regex: queryDto.searchEmailTerm, $options: 'i' };
    }

    if (queryDto.searchLoginTerm) {
      filter.login = { $regex: queryDto.searchLoginTerm, $options: 'i' };
    }
    console.log(typeof skip);
    const users: WithId<UserType>[] = await userCollection
      .find(filter)
      // .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(skip)
      .limit(queryDto.pageSize)
      .toArray();

    const totalCount: number = await userCollection.countDocuments(filter);

    return {
      items: users,
      totalCount,
    };
  },
  async getUserByLoginOrEmail(login: string, email: string) {
    return userCollection.findOne({ $or: [{ login }, { email }] });
  },
  async getUserByLogin(login: string) {
    await userCollection.findOne({ login });
  },
  async getUserByEmail(email: string) {
    await userCollection.findOne({ email });
  },
};
