import { body, ValidationChain } from 'express-validator';

export const authValidation: ValidationChain[] = [
  body('loginOrEmail')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
  body('password')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters long'),
];
