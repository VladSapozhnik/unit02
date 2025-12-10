import { body, ValidationChain } from 'express-validator';

export const passwordRecoveryValidation: ValidationChain[] = [
  body('email')
    .exists()
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be a string')
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    .withMessage('Email address must be valid'),
];
