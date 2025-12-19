// | Middleware Function | Purpose                                                                 |
// |---------------------|-------------------------------------------------------------------------|
// | validateRegister    | Validates registration input (names, email, strong password rules)       |
// | validateLogin       | Validates login input (ensures email format and password is provided)    |

const { body, validationResult } = require("express-validator");
const {BAD_REQUEST, MINIMUM_ALLOWED_LENGTH_PASSWORD, MINIMUM_ALLOWED_LENGTH_FIRSTNAME, MINIMUM_ALLOWED_LENGTH_LASTNAME } = require("../config/global_variables")

const validateRegister = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: MINIMUM_ALLOWED_LENGTH_FIRSTNAME }).withMessage("First name must be at least 3 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: MINIMUM_ALLOWED_LENGTH_LASTNAME }).withMessage("Last name must be at least 3 characters"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: MINIMUM_ALLOWED_LENGTH_PASSWORD }).withMessage("Password must be at least 8 characters")
    .not().matches(/\s/).withMessage("Password cannot contain spaces or other whitespace characters")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character (@$!%*?&)"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    next();
  },
];

const validateLogin = [
  body("email")
    .notEmpty().withMessage("Email and password are required")
    .isEmail().withMessage("Valid email is required"),
  body("password")
    .notEmpty().withMessage("Email and password are required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    next();
  },
];

module.exports = { validateRegister, validateLogin };
