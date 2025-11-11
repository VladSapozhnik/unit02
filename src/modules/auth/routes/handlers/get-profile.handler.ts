import { Request, Response } from 'express';
import { usersQueryRepository } from '../../../users/repositories/users.query.repository';
import { HTTP_STATUS } from '../../../../core/enums/http-status.enum';
import { ProfileType } from '../../../users/type/profile.type';

export interface RequestWithUserId extends Request {
  userId: string;
}

export const getProfileHandler = async (req: Request, res: Response) => {
  const userId: string = req.userId as string;

  const getProfile: ProfileType | null =
    await usersQueryRepository.getProfile(userId);

  if (!getProfile) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401);
    return;
  }
  res.json(getProfile);
};
