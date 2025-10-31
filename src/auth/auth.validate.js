const { body, validationResult } = require("express-validator");

exports.validateSignUpCoordinator = [
  body("username").isLength({ min: 6 }).withMessage("Invalid Username"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .isLength({ min: 3 })
    .withMessage("Phone must be at least 3 characters long"),
  body("position")
    .isLength({ min: 20 })
    .withMessage("Position must be at least 20 characters long"),
];

exports.validateSignUpVolunteer = [
  body("username").isLength({ min: 6 }).withMessage("Invalid Username"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .isLength({ min: 3 })
    .withMessage("Phone must be at least 3 characters long"),
  body("HoursContributed")
    .optional()
    .isFloat({ min: 2 })
    .withMessage("HoursContributed must be a number"),
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
