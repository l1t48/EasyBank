// // // | Middleware Function         | Purpose                                                                 |
// // // |-----------------------------|-------------------------------------------------------------------------|
// // // | validateTransactionCreation | Validates transaction input (type, amount, user IDs) and ensures users exist |

const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { MINIMUM_ALLOWED_AMOUNT_PER_TRANSACTION, BAD_REQUEST } = require("../config/global_variables")

const validateTransactionCreation = [
  body("transactionType")
    .notEmpty().withMessage("Transaction type is required")
    .isIn(["Deposit", "Withdrawal", "Transfer"])
    .withMessage("Transaction type must be 'deposit', 'withdrawal', or 'transfer'"),
  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ gt: MINIMUM_ALLOWED_AMOUNT_PER_TRANSACTION }).withMessage("Amount must be 150 or greater")
    .custom(async (amount, { req }) => {
      const userId = req.user.userId;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (req.body.transactionType === "Withdrawal" || req.body.transactionType === "Transfer") {
        if (user.balance < parseFloat(amount)) {
          throw new Error(`Insufficient funds. You have ${user.balance} but tried to move ${amount}`);
        }
      }
      req.currentUser = user;
      return true;
    }),
  body("targetAccountNumber")
    .if(body("transactionType").equals("Transfer"))
    .notEmpty().withMessage("Target account number is required for transfer")
    .custom(async (value, { req }) => {
      const targetUser = await User.findOne({ accountNumber: value });
      if (!targetUser) {
        throw new Error("Target account does not exist");
      }
      if (targetUser.accountType !== 'User') {
        throw new Error("Transfers are only allowed between standard user accounts.");
      }
      if (targetUser._id.toString() === req.user.userId) {
        throw new Error("You cannot transfer money to your own account");
      }
      req.targetUserId = targetUser._id;
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateTransactionCreation };