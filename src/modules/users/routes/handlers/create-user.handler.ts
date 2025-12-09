// import { Response } from 'express';
// import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
// import { usersService } from '../../application/users.service';
// import { RequestWithBody } from '../../../../core/types/request.type';
// import { CreateUserDto } from '../../dto/create-user.dto';
// import { usersQueryRepository } from '../../repositories/users.query.repository';
// import { BadRequestError } from '../../../../core/errors/bad-request.error';
// import { UserOutputType } from '../../type/user-output.type';
//
// export const createUserHandler = async (
//   req: RequestWithBody<CreateUserDto>,
//   res: Response,
// ) => {
//   const id: string = await usersService.createUser(req.body);
//
//   const findUser: UserOutputType | null =
//     await usersQueryRepository.getUserById(id);
//
//   if (!findUser) {
//     throw new BadRequestError('User does not exist', 'user');
//   }
//
//   res.status(HTTP_STATUS.CREATED_201).send(findUser);
// };
