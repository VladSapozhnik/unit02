import { param } from 'express-validator';

export const blogIdParamValidation = param('blogId')
  .exists()
  .withMessage('BlogId is required')
  .isString()
  .withMessage('BlogId must be a string')
  .isMongoId()
  .withMessage('BlogId incorrect format of ObjectId');
