import { param } from 'express-validator';

export const blogIdParamValidation = param('blogId')
  .exists()
  .withMessage('blogId is required')
  .isString()
  .withMessage('blogId must be a string')
  .isMongoId()
  .withMessage('blogId must be a valid ObjectId');
