import { param, ValidationChain } from 'express-validator';

export const deviceIdParamValidation: ValidationChain = param('deviceId')
  .exists()
  .withMessage('deviceId is required')
  .isString()
  .withMessage('deviceId must be a string');
