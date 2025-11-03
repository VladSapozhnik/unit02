import { Request, Response } from 'express';
import { usersQueryRepository } from '../../repositories/users.query.repository';
import { WithId } from 'mongodb';
import { UserType } from '../../type/user.type';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const users: WithId<UserType>[] = await usersQueryRepository.getAllUsers();
    res.send({ message: 'Get users' });
  } catch (e) {
    errorsHandler(e, res);
  }
};
