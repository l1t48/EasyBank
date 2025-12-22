// | Middleware Function | Purpose                                                                 |
// |---------------------|-------------------------------------------------------------------------|
// | validateRegister    | Validates registration input (names, email, strong password rules)       |
// | validateLogin       | Validates login input (ensures email format and password is provided)    |

const { body, validationResult } = require("express-validator");
const { BAD_REQUEST, MINIMUM_ALLOWED_LENGTH_PASSWORD, MINIMUM_ALLOWED_LENGTH_FIRSTNAME, MINIMUM_ALLOWED_LENGTH_LASTNAME } = require("../config/global_variables")

const validateRegister = [
  body("firstName")
    .notEmpty().withMessage("First name is required")
    .isLength({ min: MINIMUM_ALLOWED_LENGTH_FIRSTNAME }).withMessage("First name must be at least 3 characters")
    .matches(/^[^\d].*$/).withMessage("First name must not start with a number"),
  body("lastName")
    .notEmpty().withMessage("Last name is required")
    .isLength({ min: MINIMUM_ALLOWED_LENGTH_LASTNAME }).withMessage("Last name must be at least 3 characters")
    .matches(/^[^\d].*$/).withMessage("Last name must not start with a number"),
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


const validateUserUpdate = [
  body("firstName")
    .optional()
    .notEmpty().withMessage("First name cannot be empty")
    .isLength({ min: MINIMUM_ALLOWED_LENGTH_FIRSTNAME }).withMessage(`First name must be at least ${MINIMUM_ALLOWED_LENGTH_FIRSTNAME} characters`)
    .matches(/^[^\d].*$/).withMessage("First name must not start with a number"),
    
  body("lastName")
    .optional()
    .notEmpty().withMessage("Last name cannot be empty")
    .isLength({ min: MINIMUM_ALLOWED_LENGTH_LASTNAME }).withMessage(`Last name must be at least ${MINIMUM_ALLOWED_LENGTH_LASTNAME} characters`)
    .matches(/^[^\d].*$/).withMessage("Last name must not start with a number"),
    
  body("email")
    .optional()
    .isEmail().withMessage("Valid email is required"),
    
  body("password")
    .optional()
    .isLength({ min: MINIMUM_ALLOWED_LENGTH_PASSWORD }).withMessage(`Password must be at least ${MINIMUM_ALLOWED_LENGTH_PASSWORD} characters`)
    .not().matches(/\s/).withMessage("Password cannot contain spaces")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character (@$!%*?&)"),

  body("balance")
    .optional()
    .notEmpty().withMessage("Amount should not be empty please enter a valid number")
    .isFloat({ min: 0 }).withMessage("Balance must be a positive number"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }
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

module.exports = { validateRegister, validateLogin, validateUserUpdate };
