/*
  | Endpoint                        | Method | Auth Required | Roles | Description                                                                 |
  | --------------------------------| ------ | ------------- | ----- | --------------------------------------------------------------------------- |
  | /api/admin/all-transactions      | GET    | Yes           | Admin | View all transactions in the system                                        |
  | /api/admin/pending-transactions  | GET    | Yes           | Admin | Review all pending transactions                                            |
  | /api/admin/approve-transaction   | POST   | Yes           | Admin | Approve a pending transaction                                              |
  | /api/admin/reject-transaction    | POST   | Yes           | Admin | Reject a pending transaction                                               |
*/

const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const User = require("../../models/User");
const Transaction = require("../../models/Transaction");
const logActivity = require("../../utils/Activitylogger");
const processTransactionType = require("../../utils/processTransactionType");
const {
  notifyTransactionUpdate,
} = require("../../utils/transactionEmitter");

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = require("../../config/global_variables")

router.use(authMiddleware);
router.use(authorizeRoles("Admin"));

router.get("/pending-transactions", authMiddleware, async (req, res) => {
  try {
    const {
      sortBy = "createdAt",
      order = "desc",
      transactionId,
      minAmount,
      maxAmount,
      transactionType,
      startDate,
      endDate,
      accountNumber,
      targetUserId
    } = req.query;

    const filter = { state: "Pending" };

    if (transactionId)
      filter.transactionId = { $regex: transactionId, $options: "i" };
    if (minAmount)
      filter.amount = { $gte: parseFloat(minAmount) };
    if (maxAmount)
      filter.amount = { ...filter.amount, $lte: parseFloat(maxAmount) };
    if (transactionType)
      filter.transactionType = transactionType;
    if (accountNumber) {
      const user = await User.findOne({ accountNumber }).lean();
      if (user) {
        filter.userId = user._id;
      } else {
        return res.json({ success: true, transactions: [] });
      }
    }
    if (targetUserId)
      filter.targetUserId = targetUserId;
    if (startDate)
      filter.createdAt = { $gte: new Date(startDate) };
    if (endDate)
      filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };

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
      targetUsers.map(u => [u.accountNumber, { firstName: u.firstName, lastName: u.lastName }])
    );

    const mappedTransactions = transactions.map(t => {
      const populatedUser = t.userId && typeof t.userId === "object" && t.userId._id ? t.userId : null;
      const userIdValue = populatedUser ? String(populatedUser._id) : (t.userId ? String(t.userId) : null);
      const userObj = populatedUser
        ? {
          _id: String(populatedUser._id),
          firstName: populatedUser.firstName || null,
          lastName: populatedUser.lastName || null,
          accountNumber: populatedUser.accountNumber || null
        }
        : null;
      const userAccountNumber = userObj?.accountNumber ?? t.userAccountNumber ?? null;
      const targetObj = t.targetAccountNumber ? (targetMap.get(t.targetAccountNumber) || null) : null;
      const { userId: _ignored, ...rest } = t;

      return {
        ...rest,
        userId: userIdValue,
        user: userObj,
        userAccountNumber,
        target: targetObj
      };
    });
    const admin = await User.findById(req.user.userId);
    await logActivity({
      userId: req.user.userId,
      userName: admin.firstName,
      userRole: req.user.accountType,
      accountNumber: admin.accountNumber,
      action: "ADMIN_VIEW_PENDING_TRANSACTIONS",
      message: "Admin viewed pending transactions",
      req
    });
    return res.json({
      success: true,
      transactions: mappedTransactions
    });
  } catch (error) {
    console.error("Get pending transactions error:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
});

router.post("/approve-transaction", authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(BAD_REQUEST).json({ error: "Transaction ID is required" });
    }
    const transaction = await Transaction.findById(transactionId);
    if (!transaction)
      return res.status(NOT_FOUND).json({ error: "Transaction not found" });
    if (transaction.state !== "Pending")
      return res.status(BAD_REQUEST).json({ error: "Only pending transactions can be approved" });
    try {
      await processTransactionType(transaction);
    } catch (procErr) {
      console.error("Process transaction error:", procErr);
      return res.status(BAD_REQUEST).json({ error: procErr.message });
    }
    transaction.state = "Approved";
    transaction.handledBy = req.user.userId;
    transaction.updatedAt = Date.now();
    await transaction.save();
    await notifyTransactionUpdate(transaction, { event: "transactionApproved" });
    const admin = await User.findById(req.user.userId);
    await logActivity({
      userId: req.user.userId,
      userName: admin.firstName,
      userRole: req.user.accountType,
      accountNumber: admin.accountNumber,
      action: "ADMIN_APPROVE_TRANSACTION",
      message: `Admin approved transaction ID: ${transactionId}`,
      req
    });
    res.json({ success: true, transaction });
  } catch (error) {
    console.error("Approve transaction error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
});

router.post("/reject-transaction", authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction)
      return res.status(NOT_FOUND).json({ error: "Transaction not found" });
    if (transaction.state !== "Pending")
      return res.status(BAD_REQUEST).json({ error: "Only pending transactions can be rejected" });
    transaction.state = "Rejected";
    transaction.handledBy = req.user.userId;
    transaction.updatedAt = Date.now();
    await transaction.save();
    await notifyTransactionUpdate(transaction, { event: "transactionRejected" });
    const admin = await User.findById(req.user.userId);
    await logActivity({
      userId: req.user.userId,
      userName: admin.firstName,
      userRole: req.user.accountType,
      accountNumber: admin.accountNumber,
      action: "ADMIN_REJECT_TRANSACTION",
      message: `Admin rejected transaction ID: ${transactionId}`,
      req
    });
    res.json({ success: true, transaction });
  } catch (error) {
    console.error("Reject transaction error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
});

router.get("/all-transactions", authMiddleware, async (req, res) => {
  try {
    const {
      sortBy = "createdAt",
      order = "desc",
      transactionId,
      minAmount,
      maxAmount,
      transactionType,
      state,
      startDate,
      endDate,
      accountNumber,
    } = req.query;

    const filter = {};

    if (transactionId)
      filter.transactionId = { $regex: transactionId, $options: "i" };
    if (minAmount)
      filter.amount = { $gte: parseFloat(minAmount) };
    if (maxAmount)
      filter.amount = { ...filter.amount, $lte: parseFloat(maxAmount) };
    if (transactionType) filter.transactionType = transactionType;
    if (state) filter.state = state;
    if (accountNumber) {
      const user = await User.findOne({ accountNumber }).lean();
      if (user) {
        filter.userId = user._id;
      } else {
        return res.json({ success: true, transactions: [] });
      }
    }
    if (startDate)
      filter.createdAt = { $gte: new Date(startDate) };
    if (endDate)
      filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };

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
      targetUsers.map(u => [u.accountNumber, { firstName: u.firstName, lastName: u.lastName }])
    );

    const mappedTransactions = transactions.map((t) => {
      const populatedUser = t.userId && t.userId._id ? t.userId : null;
      const userIdValue = populatedUser ? String(populatedUser._id) : (t.userId ? String(t.userId) : null);
      const userObj = populatedUser
        ? {
          _id: String(populatedUser._id),
          firstName: populatedUser.firstName,
          lastName: populatedUser.lastName,
          accountNumber: populatedUser.accountNumber ?? null
        }
        : null;
      const userAccountNumber = userObj?.accountNumber ?? t.userAccountNumber ?? null;
      const targetObj = t.targetAccountNumber ? (targetMap.get(t.targetAccountNumber) || null) : null;
      const { userId: _populated, ...rest } = t;
      return {
        ...rest,
        userId: userIdValue,
        user: userObj,
        userAccountNumber,
        target: targetObj
      };
    });
    const admin = await User.findById(req.user.userId);
    await logActivity({
      userId: req.user.userId,
      userName: admin.firstName,
      userRole: req.user.accountType,
      accountNumber: admin.accountNumber,
      action: "ADMIN_VIEW_ALL_TRANSACTIONS",
      message: "Admin viewed all transactions",
      req
    });
    return res.json({
      success: true,
      transactions: mappedTransactions
    });
  } catch (error) {
    console.error("Get all transactions error:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
});

module.exports = router;
