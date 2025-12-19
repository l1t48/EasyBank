const rateLimit = require("express-rate-limit");
const {LOGIN_LIMITER_MIN_AMOUNT, REGISTER_LIMITER_MIN_AMOUNT, TRANSACTION_LIMITER_MIN_AMOUNT, ALLOWED_LOGIN_ATTEMPT, ALLOWED_REGISTER_ATTEMPT, ALLOWED_TRANSACTION_ATTEMPT, SEC_AMOUNT_PER_MIN, MS_AMOUNT_PER_SEC} = require("../config/global_variables")

const loginLimiter = rateLimit({
  windowMs: LOGIN_LIMITER_MIN_AMOUNT * SEC_AMOUNT_PER_MIN * MS_AMOUNT_PER_SEC, // 20 minutes
  max: ALLOWED_LOGIN_ATTEMPT, 
  skipSuccessfulRequests: true, 
  keyGenerator: (req) => req["ip"],
  message: {
    error: "Too many login attempts. Please try again after 20 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: REGISTER_LIMITER_MIN_AMOUNT * SEC_AMOUNT_PER_MIN * MS_AMOUNT_PER_SEC, // 15 min
  max: ALLOWED_REGISTER_ATTEMPT,
  keyGenerator: (req) => req["ip"],
  validate: { xForwardedForHeader: false, default: true },
  message: {
    error: "Too many registration attempts. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

const transactionLimiter = rateLimit({
  windowMs: TRANSACTION_LIMITER_MIN_AMOUNT * SEC_AMOUNT_PER_MIN * MS_AMOUNT_PER_SEC,  // 24 hours
  max: ALLOWED_TRANSACTION_ATTEMPT,
  keyGenerator: (req) => {
    return req.user && req.user._id ? req.user._id.toString() : req["ip"];
  },
  validate: { xForwardedForHeader: false, default: true },
  message: {
    error: "Too many transactions in a short period. Please wait."
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { loginLimiter, registerLimiter, transactionLimiter };