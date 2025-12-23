import { param, ValidationChain } from 'express-validator';

export const postIdParamValidation: ValidationChain = param('postId')
  .exists()
  .withMessage('postId is required')
  .isString()
  .withMessage('postId must be a string')
  .isMongoId()
  .withMessage('postId must be a valid ObjectId');
