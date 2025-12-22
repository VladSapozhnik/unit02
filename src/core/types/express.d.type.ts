import { UserType } from '../../modules/users/entities/user.type';
import { WithId } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
