import { UserType } from '../../modules/users/domain/user.type';

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}
