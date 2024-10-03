const { body, validationResult } = require('express-validator');
const { sendResponse } = require('../utility/api');

const requestValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedResults = [];
    errors.array().forEach(err => extractedResults.push({[err.path]: err.msg}));

    return sendResponse(res, 422, 'Invalid request data', extractedResults, []);
}

// SAMPLE_CODE
// body('email')
// .not().isEmpty().withMessage('Email is required').bail()
// .isEmail().withMessage('Provide a valid email')
// .toLowerCase()
// .trim(),
// body('password')
//     .not().isEmpty().withMessage('Password is required').bail()
//     .isString().withMessage('Password must be of type String').bail()
//     .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters')
//     .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must contain atleast one lowercase, uppercase, number and special characters'),

const createUserValidation = [
    body('name').not().isEmpty().withMessage("name is required"),
    body('email').not().isEmpty().isEmail().withMessage("Valid Email is required"),
    body('role').not().isEmpty().withMessage("role is required"),
    body('password')
    .not().isEmpty().withMessage('Password is required').bail()
    .isString().withMessage('Password must be of type String').bail()
    .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters')

]

const loginValidation = [
  body('email').not().isEmpty().isEmail().withMessage("Valid Email is required"),
  body('password').not().isEmpty().withMessage("password is required"),
]

const createTaskValidation = [
    body('title').not().isEmpty().withMessage("title is required"),
    body('description').not().isEmpty().withMessage("description is required"),
    body('dueDate').not().isEmpty().withMessage("dueDate is required")
]

module.exports = {
  requestValidation,
  createUserValidation,
  loginValidation,
  createTaskValidation,
};
