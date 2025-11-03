import { query, ValidationChain } from 'express-validator';

export const userQuerySearchValidation: ValidationChain[] = [
  query('searchLoginTerm')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 30 })
    .withMessage('searchLoginTerm must be a string up to 30 characters'),
  query('searchEmailTerm')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 30 })
    .withMessage('searchEmailTerm must be a string up to 30 characters'),
];
