/*
| Endpoint                              | Method | Auth Required | Roles | Description                                                                                 |
|---------------------------------------|--------|---------------|-------|---------------------------------------------------------------------------------------------|
| /api/user/create-transaction          | POST   | Yes           | User  | Creates a new transaction (deposit, withdrawal, or transfer) with validation and rate limit|
| /api/user/transactions                | GET    | Yes           | User  | Returns user transaction history with filtering, sorting, and received/sent distinction    |
| /api/user/cancel-transaction/:id      | PATCH  | Yes           | User  | Cancels a pending transaction and notifies relevant users and staff in real time            |
*/

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../../models/User");
const Transaction = require("../../models/Transaction");
const logActivity = require('../../utils/Activitylogger');
const authMiddleware = require("../../middlewares/authMiddleware");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const { validateTransactionCreation } = require("../../middlewares/validateTransactionCreation");
const { transactionLimiter } = require("../../middlewares/rateLimiter");
const { emitToUser, emitToRole, notifyTransactionUpdate, toPublicJson } = require("../../utils/transactionEmitter");
const { SUPERVISOR_APPROVAL_LIMIT, CREATED, BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR, NOT_FOUND } = require("../../config/global_variables")

router.use(authMiddleware);
router.use(authorizeRoles("User"));

router.post("/create-transaction", authMiddleware, transactionLimiter, validateTransactionCreation, async (req, res) => {
  try {
    const { transactionType, amount, targetAccountNumber } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user || !user._id) {
      return res.status(UNAUTHORIZED).json({ error: "Unauthorized: user not found in token" });
    }
    const requiresAdminApproval = amount >= SUPERVISOR_APPROVAL_LIMIT;

    const transactionData = {
      transactionType,
      amount,
      userId: user._id,
      state: "Pending",
    };

    let targetUser = null;

    if (transactionType === "Transfer") {
      targetUser = await User.findOne({ accountNumber: targetAccountNumber });
      if (!targetUser) {
        return res.status(BAD_REQUEST).json({ error: "Target user not found for transfer" });
      }
      transactionData.targetAccountNumber = targetAccountNumber;
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();

    const performer = {
      accountNumber: user.accountNumber,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim()
    };

    await emitToUser(user._id.toString(), "transactionCreated", toPublicJson(transaction, "user", performer));

    if (targetUser) {
      await emitToUser(targetUser._id.toString(), "transactionCreated", {
        id: transaction._id,
        notice: "incoming_transfer",
        state: transaction.state
      });
    }

    const supPayload = toPublicJson(transaction, "supervisor", performer);
    const adminPayload = toPublicJson(transaction, "admin", performer);

    if (!requiresAdminApproval) {
      await emitToRole("supervisor", "pendingTransactionCreated", supPayload);
      console.log(`Notifying supervisor of pending transaction: ${transaction._id}`);
    }

    await emitToRole("admin", "pendingTransactionCreated", adminPayload);
    console.log(`Notifying admin of pending transaction: ${transaction._id}`);

    await logActivity({
      userId: user._id,
      userName: user.firstName,
      userRole: user.accountType,
      accountNumber: user.accountNumber,
      action: transactionType === "Transfer" ? "TRANSFER" : "CREATE_TRANSACTION",
      message:
        transactionType === "Transfer"
          ? `Transferred ${amount} to ${targetUser.firstName} (Account: ${targetAccountNumber})`
          : `Transaction of type ${transactionType} created with amount ${amount}`,
      req,
    });

    return res.status(CREATED).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err) {
    console.error("Transaction creation error:", err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ error: err.message, details: err.errors });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
}
);

router.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const {
      sortBy = "createdAt",
      order = "desc",
      transactionId,
      minAmount,
      maxAmount,
      transactionType,
      state,
      startDate,
      endDate
    } = req.query;

    const currentUser = await User.findById(userId).lean();
    if (!currentUser) return res.status(NOT_FOUND).json({ error: "User not found" });

    const filter = {
      $or: [
        { userId },
        { targetAccountNumber: currentUser.accountNumber }
      ]
    };

    if (transactionId) filter.transactionId = { $regex: transactionId, $options: "i" };
    if (minAmount) filter.amount = { ...filter.amount, $gte: parseFloat(minAmount) };
    if (maxAmount) filter.amount = { ...filter.amount, $lte: parseFloat(maxAmount) };
    if (transactionType) filter.transactionType = transactionType;
    if (state) filter.state = state;
    if (startDate) filter.createdAt = { ...filter.createdAt, $gte: new Date(startDate) };
    if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };

    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;

    const transactions = await Transaction.find(filter)
      .sort(sortOptions)
      .populate("userId", "firstName lastName accountNumber")
      .lean();


    const targetNumbers = [
      ...new Set(transactions.map(t => t.targetAccountNumber).filter(Boolean))
    ];

    const targetUsers = targetNumbers.length
      ? await User.find(
        { accountNumber: { $in: targetNumbers } },
        "firstName lastName accountNumber"
      ).lean()
      : [];

    const targetMap = new Map(
      targetUsers.map(u => [u.accountNumber, { firstName: u.firstName, lastName: u.lastName, accountNumber: u.accountNumber }])
    );

    const mappedTransactions = transactions.map(t => {
      const senderObj = t.userId
        ? { firstName: t.userId.firstName, lastName: t.userId.lastName, accountNumber: t.userId.accountNumber }
        : null;

      const targetObj = t.targetAccountNumber ? (targetMap.get(t.targetAccountNumber) || null) : null;

      const isReceived = t.targetAccountNumber === currentUser.accountNumber;
      const transactionTypeLabel = isReceived ? "receive" : t.transactionType;

      return {
        ...t,
        user: senderObj,
        target: targetObj,
        transactionType: transactionTypeLabel
      };
    });

    await logActivity({
      userId,
      userName: currentUser.firstName,
      userRole: currentUser.accountType,
      accountNumber: currentUser.accountNumber,
      action: "USER_VIEW_TRANSACTIONS",
      message: "User viewed their transaction history",
      req
    });

    return res.json({
      success: true,
      transactions: mappedTransactions
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
});

router.patch("/cancel-transaction/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(BAD_REQUEST).json({ error: "Invalid transaction ID" });

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(NOT_FOUND).json({ error: "Transaction not found" });
    if (transaction.state !== "Pending")
      return res.status(BAD_REQUEST).json({ error: "Only pending transactions can be canceled" });

    transaction.state = "Canceled";
    transaction.updatedAt = Date.now();
    await transaction.save();

    await notifyTransactionUpdate(transaction, { event: "transactionCanceled" });

    try {
      const user = await User.findById(req.user.userId);
      await logActivity({
        userId: req.user.userId,
        userName: user.firstName,
        userRole: req.user.accountType,
        accountNumber: user.accountNumber,
        action: "USER_CANCEL_TRANSACTION",
        message: "Transaction canceled",
        req
      });
    } catch (logError) {
      console.error("Log activity error:", logError);
    }

    res.json({ success: true, transaction });
  } catch (error) {
    console.error("Cancel transaction error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
});

module.exports = router;