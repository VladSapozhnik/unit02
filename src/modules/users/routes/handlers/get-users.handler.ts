import { Request, Response } from 'express';
import { usersQueryRepository } from '../../repositories/users.query.repository';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { matchedData } from 'express-validator';
import { UserQueryInput } from '../input/user-query.input';

export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const sanitizedQuery: UserQueryInput = matchedData<UserQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const { items, totalCount } =
      await usersQueryRepository.getAllUsers(sanitizedQuery);
    res.send({ message: 'Get users' });
  } catch (e) {
    errorsHandler(e, res);
  }
};
