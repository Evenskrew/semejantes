const validateCreateEvent = [
  body("description")
    .isLength({ max: 300 })
    .withMessage("Description must be max 300 characters long"),
  body("date")
    .isISO8601()
    .withMessage("Date must be this format: (YYYY-MM-DD).")
    .toDate(),
  body("duration").isFloat().withMessage("duration must be a number"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
