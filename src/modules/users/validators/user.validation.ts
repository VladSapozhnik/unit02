import { body, ValidationChain } from 'express-validator';

export const userValidation: ValidationChain[] = [
  body('login')
    .exists()
    .withMessage('Login is required')
    .isString()
    .withMessage('login must be a string')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Only letters, numbers, hyphens, and underscores are allowed')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Login must be between 3 and 10 characters long'),
  body('password')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters long'),
  body('email')
    .exists()
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be a string')
    .matches(/^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/)
    .withMessage('Email address must be valid'),
];
