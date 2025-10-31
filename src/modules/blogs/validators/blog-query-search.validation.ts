import { query } from 'express-validator';

export const blogQuerySearchValidation = [
  query('searchNameTerm')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 30 })
    .withMessage('searchBlogNameTerm must be a string up to 30 characters'),
];
