import { query, ValidationChain } from 'express-validator';

export const confirmEmailValidation: ValidationChain[] = [
  query('code')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
];
