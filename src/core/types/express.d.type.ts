import { UserType } from '../../modules/users/domain/user.type';
import { WithId } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
