import { body } from 'express-validator';

export const basePostValidator = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Title length must be between 2 and 30'),
  body('shortDescription')
    .isString()
    .withMessage('ShortDescription must be a string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('ShortDescription length must be between 2 and 100'),
  body('content')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage('Content length must be between 2 and 1000'),
  body('blogId')
    .exists()
    .withMessage('blogId is required')
    .isString()
    .withMessage('blogId must be a string')
    .isMongoId()
    .withMessage('Incorrect format of ObjectId'),
];
