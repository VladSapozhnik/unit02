import { body, ValidationChain } from 'express-validator';

export const passwordRecoveryValidation: ValidationChain[] = [
  body('email')
    .exists()
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be a string')
    .matches(/^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Email address must be valid'),
];
