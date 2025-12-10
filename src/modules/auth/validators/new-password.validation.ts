import { body, ValidationChain } from 'express-validator';

export const newPasswordValidation: ValidationChain[] = [
  body('recoveryCode')
    .exists()
    .withMessage('newPassword is required')
    .isString()
    .withMessage('newPassword must be a string'),
  body('newPassword')
    .exists()
    .withMessage('newPassword is required')
    .isString()
    .withMessage('newPassword must be a string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('newPassword must be between 6 and 20 characters long'),
];
