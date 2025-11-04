import { Request, Response } from 'express';
import { usersQueryRepository } from '../../repositories/users.query.repository';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { matchedData } from 'express-validator';
import { UserQueryInput } from '../input/user-query.input';
import { userListPaginatedOutputMapper } from '../mappers/user-list-paginated-output.mapper';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
import { UserSortFieldEnum } from '../../enum/user-sort-field.enum';
import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';

export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const sanitizedQuery: UserQueryInput = matchedData<UserQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const defaultQuery: PaginationAndSortingType<UserSortFieldEnum> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const { items, totalCount } =
      await usersQueryRepository.getAllUsers(defaultQuery);

    const usersOutput = userListPaginatedOutputMapper(items, {
      pagesCount: Math.ceil(totalCount / defaultQuery.pageSize),
      pageNumber: defaultQuery.pageNumber,
      pageSize: defaultQuery.pageSize,
      totalCount,
    });

    res.send(usersOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
};
