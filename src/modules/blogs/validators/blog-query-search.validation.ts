import { query, ValidationChain } from 'express-validator';

export const blogQuerySearchValidation: ValidationChain[] = [
  query('searchNameTerm')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 30 })
    .withMessage('searchBlogNameTerm must be a string up to 30 characters'),
];
