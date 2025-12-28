import { CreateUserDto } from '../dto/create-user.dto';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { hashAdapter } from '../../../core/adapters/hash.adapter';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { inject, injectable } from 'inversify';
import { UsersRepository } from '../repositories/users.repository';
import { UsersDocument, UsersModel } from '../entities/user.entity';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const isUser: UsersDocument | null =
      await this.usersRepository.getUserByLoginOrEmail(dto.login, dto.email);

    if (isUser) {
      throw new BadRequestError('User already exists', 'user');
    }

    const hash: string = await hashAdapter.hashPassword(dto.password);

    const newUser = new UsersModel({
      login: dto.login,
      email: dto.email,
      password: hash,
      emailConfirmation: {
        confirmationCode: 'superAdmin',
        expirationDate: new Date(),
        isConfirmed: true,
      },
    });

    return this.usersRepository.createUser(newUser);
  }

  async removeUser(id: string) {
    const isRemove: boolean = await this.usersRepository.removeUser(id);

    if (!isRemove) {
      throw new NotFoundError('User is not found!', 'user');
    }
  }
}
