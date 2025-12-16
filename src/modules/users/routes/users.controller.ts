import {
  RequestWithBody,
  RequestWithParam,
} from '../../../core/types/request.type';
import { CreateUserDto } from '../dto/create-user.dto';
import { Request, Response } from 'express';
import { UserOutputType } from '../type/user-output.type';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { HTTP_STATUS } from '../../../core/enums/http-status.enum';
import { UserQueryInput } from './input/user-query.input';
import { matchedData } from 'express-validator';
import { PaginationAndSortingType } from '../../../core/types/pagination-and-sorting.type';
import { UserSortFieldEnum } from '../enums/user-sort-field.enum';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../core/helpers/set-default-sort-and-pagination.helper';
import { inject, injectable } from 'inversify';
import { type IdUserParamDto } from '../dto/id-user-param.dto';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../repositories/users.query.repository';

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) private readonly usersService: UsersService,
    @inject(UsersQueryRepository)
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async createUser(req: RequestWithBody<CreateUserDto>, res: Response) {
    const id: string = await this.usersService.createUser(req.body);

    const findUser: UserOutputType | null =
      await this.usersQueryRepository.getUserById(id);

    if (!findUser) {
      throw new BadRequestError('User does not exist', 'user');
    }

    res.status(HTTP_STATUS.CREATED_201).send(findUser);
  }

  async getUsers(req: Request, res: Response) {
    const sanitizedQuery: UserQueryInput = matchedData<UserQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const defaultQuery: PaginationAndSortingType<UserSortFieldEnum> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const usersOutput =
      await this.usersQueryRepository.getAllUsers(defaultQuery);

    res.send(usersOutput);
  }

  async removeUser(req: RequestWithParam<IdUserParamDto>, res: Response) {
    const id: string = req.params.id;

    await this.usersService.removeUser(id);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}
