import { query } from 'express-validator';

export const BlogQuerySearchValidation = [
  query('searchBlogNameTerm')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 30 })
    .withMessage('searchBlogNameTerm must be a string up to 30 characters'),
];
