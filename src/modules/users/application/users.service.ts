import { CreateUserDto } from '../dto/create-user.dto';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { EmailConfirmation, UserDbType } from '../type/user.type';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { hashAdapter } from '../../../core/adapters/hash.adapter';
import { ObjectId } from 'mongodb';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { inject, injectable } from 'inversify';
import { UsersRepository } from '../repositories/users.repository';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const hash: string = await hashAdapter.hashPassword(dto.password);

    const newUser: UserDbType = new UserDbType(
      new ObjectId(),
      dto.login,
      dto.email,
      hash,
      createdAtHelper(),
      new EmailConfirmation('', new Date(), true),
    );

    const isUser: UserDbType | null =
      await this.usersRepository.getUserByLoginOrEmail(dto.login, dto.email);

    if (isUser) {
      throw new BadRequestError('User already exists', 'user');
    }

    return this.usersRepository.createUser(newUser);
  }

  async removeUser(id: string) {
    const isRemove: boolean = await this.usersRepository.removeUser(id);

    if (!isRemove) {
      throw new NotFoundError('User is not found!', 'user');
    }
  }
}
