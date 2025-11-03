import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { usersService } from '../../application/users.service';
import { WithId } from 'mongodb';
import { UserType } from '../../type/user.type';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const users: WithId<UserType> = await usersService.createUser(req.body);

    res.status(HTTP_STATUS.CREATED_201).send({ message: 'Post successfully' });
  } catch (e) {
    errorsHandler(e, res);
  }
};
