const { body, validationResult } = require('express-validator');

const validateScore = async (req, res, next) => {
  // Validation nickname
  await body('nickname')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Nickname must be between 2 and 20 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Nickname can only contain letters, numbers and underscores.')
    .run(req);

  // Validation score
  await body('score')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Points must be a number from 0 or more')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = validateScore;