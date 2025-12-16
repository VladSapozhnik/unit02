import { body, ValidationChain } from 'express-validator';
import { LikeStatusEnum } from '../../likes/enums/like-status.enum';

const statusLikeValues: LikeStatusEnum[] = Object.values(LikeStatusEnum);

export const likeStatusValidation: ValidationChain[] = [
  body('likeStatus').isIn(statusLikeValues).withMessage('Invalid like status'),
];
