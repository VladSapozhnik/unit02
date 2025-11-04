import { Response } from 'express';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { usersService } from '../../application/users.service';
import { WithId } from 'mongodb';
import { UserType } from '../../type/user.type';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { userMapper } from '../mappers/user.mapper';
import { RequestWithBody } from '../../../../core/types/request.type';
import { CreateUserDto } from '../../dto/create-user.dto';

export const createUserHandler = async (
  req: RequestWithBody<CreateUserDto>,
  res: Response,
) => {
  try {
    const createdUser: WithId<UserType> = await usersService.createUser(
      req.body,
    );

    res.status(HTTP_STATUS.CREATED_201).send(userMapper(createdUser));
  } catch (e) {
    errorsHandler(e, res);
  }
};
