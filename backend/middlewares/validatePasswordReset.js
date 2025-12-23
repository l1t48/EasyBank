// | Middleware Function     | Purpose                                                                 |
// |--------------------------|-------------------------------------------------------------------------|
// | validatePasswordChange   | Ensures old/new passwords are provided and that the new one is different |

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User"); 
const {MINIMUM_ALLOWED_LENGTH_PASSWORD, BAD_REQUEST, INTERNAL_SERVER_ERROR} = require("../config/global_variables")

const validatePasswordReset = [
  body("newPassword")
    .isLength({ min: MINIMUM_ALLOWED_LENGTH_PASSWORD }).withMessage("Password must be at least 8 characters")
    .not().matches(/\s/).withMessage("Password cannot contain spaces or other whitespace characters")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character (@$!%*?&)"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(BAD_REQUEST).json({ errors: errors.array() });
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
      const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const user = await User.findOne({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpire: { $gt: Date.now() }
      });
      if (!user) {
        return res.status(BAD_REQUEST).json({ error: "Invalid or expired token" });
      }
      const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
      if (isSamePassword) {
        return res.status(BAD_REQUEST).json({ error: "New password must be different from the old password." });
      }
      req.userForReset = user;
      next();

    } catch (err) {
      console.error("Password reset validation error:", err);
      return res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  },
];

module.exports = validatePasswordReset;
