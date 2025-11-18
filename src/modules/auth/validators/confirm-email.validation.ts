import { body, ValidationChain } from 'express-validator';

export const confirmEmailValidation: ValidationChain[] = [
  body('code')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
];
