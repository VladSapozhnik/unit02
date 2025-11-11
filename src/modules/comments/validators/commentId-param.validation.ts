import { param, ValidationChain } from 'express-validator';

export const commentIdParamValidation: ValidationChain = param('commentId')
  .exists()
  .withMessage('blogId is required')
  .isString()
  .withMessage('blogId must be a string')
  .isMongoId()
  .withMessage('blogId must be a valid ObjectId');
