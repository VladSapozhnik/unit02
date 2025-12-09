// import { Request, Response } from 'express';
// import { usersQueryRepository } from '../../repositories/users.query.repository';
// import { matchedData } from 'express-validator';
// import { UserQueryInput } from '../input/user-query.input';
// import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../../core/helpers/set-default-sort-and-pagination.helper';
// import { UserSortFieldEnum } from '../../enum/user-sort-field.enum';
// import { PaginationAndSortingType } from '../../../../core/types/pagination-and-sorting.type';
//
// export const getUsersHandler = async (req: Request, res: Response) => {
//   const sanitizedQuery: UserQueryInput = matchedData<UserQueryInput>(req, {
//     locations: ['query'],
//     includeOptionals: true,
//   });
//
//   const defaultQuery: PaginationAndSortingType<UserSortFieldEnum> =
//     setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);
//
//   const usersOutput = await usersQueryRepository.getAllUsers(defaultQuery);
//
//   res.send(usersOutput);
// };
