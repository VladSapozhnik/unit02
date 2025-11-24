import { Request, Response } from 'express';
import { usersQueryRepository } from '../../../users/repositories/users.query.repository';
import { ProfileType } from '../../../users/type/profile.type';
import { UnauthorizedError } from '../../../../core/errors/unauthorized.error';

export interface RequestWithUserId extends Request {
  userId: string;
}

export const getProfileHandler = async (req: Request, res: Response) => {
  const userId: string = req.userId as string;

  const getProfile: ProfileType | null =
    await usersQueryRepository.getProfile(userId);

  if (!getProfile) {
    throw new UnauthorizedError('User not found', 'profile');
  }
  res.json(getProfile);
};
