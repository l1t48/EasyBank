/*
| Endpoint                                   | Method | Auth Required | Roles      | Description                                                                 |
|--------------------------------------------|--------|---------------|------------|-----------------------------------------------------------------------------|
| /api/supervisor/pending-transactions       | GET    | Yes           | Supervisor | Retrieves pending transactions within supervisor approval limit, with filters |
| /api/supervisor/approve-transaction        | POST   | Yes           | Supervisor | Approves a pending transaction that is within the supervisor’s limit        |
| /api/supervisor/reject-transaction         | POST   | Yes           | Supervisor | Rejects a pending transaction and notifies relevant parties                 |
*/

const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Transaction = require("../../models/Transaction");
const logActivity = require('../../utils/Activitylogger');
const authMiddleware = require("../../middlewares/authMiddleware");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const processTransactionType = require("../../utils/processTransactionType");
const { SUPERVISOR_APPROVAL_LIMIT, BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } = require("../../config/global_variables")

const {
  notifyTransactionUpdate, 
} = require("../../utils/transactionEmitter");

router.use(authMiddleware);
router.use(authorizeRoles("Supervisor"));

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

    const filter = {
      state: "Pending",      
      amount: { $lt: SUPERVISOR_APPROVAL_LIMIT } 
    };

    if (transactionId)
      filter.transactionId = { $regex: transactionId, $options: "i" };

    if (minAmount)
      filter.amount = { ...filter.amount, $gte: parseFloat(minAmount) };

    if (maxAmount)
      filter.amount = { ...filter.amount, $lte: parseFloat(maxAmount) };

    if (transactionType) filter.transactionType = transactionType;

    if (accountNumber) {
      const user = await User.findOne({ accountNumber }).lean();
      if (user) {
        filter.userId = user._id;
      } else {
        return res.json({ success: true, transactions: [] });
      }
    }

    if (targetUserId) filter.targetUserId = targetUserId;

    if (startDate) filter.createdAt = { $gte: new Date(startDate) };
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
      targetUsers.map(u => [u.accountNumber, { firstName: u.firstName, lastName: u.lastName }])
    );

    const mappedTransactions = transactions.map(t => {
      const populatedUser = t.userId && typeof t.userId === "object" ? t.userId : null;
      const normalizedUserId = populatedUser?._id || t.userId || null;
      const userAccountNumber = populatedUser?.accountNumber || t.userAccountNumber || null;
      const userObj = populatedUser
        ? {
          firstName: populatedUser.firstName,
          lastName: populatedUser.lastName,
          accountNumber: populatedUser.accountNumber,
          _id: normalizedUserId
        }
        : null;
      const targetObj = t.targetAccountNumber ? (targetMap.get(t.targetAccountNumber) || null) : null;

      return {
        ...t,
        userId: normalizedUserId,
        userAccountNumber,
        user: userObj,
        target: targetObj
      };
    });

    const supervisor = await User.findById(req.user.userId);
    await logActivity({
      userId: req.user.userId,
      userName: supervisor.firstName,
      userRole: req.user.accountType,
      accountNumber: supervisor.accountNumber,
      action: "SUPERVISOR_VIEW_PENDING_TRANSACTIONS",
      message: "Supervisor viewed pending transactions" + (Object.keys(req.query).length > 0 ? " with filters" : ""),
      req
    });

    res.json({ success: true, transactions: mappedTransactions });
  } catch (error) {
    console.error("Get pending transactions error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
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
    if (transaction.amount >= SUPERVISOR_APPROVAL_LIMIT) {
      return res.status(FORBIDDEN).json({ error: "Transaction amount exceeds supervisor's approval limit." });
    }
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
    const supervisor = await User.findById(req.user.userId);

    await logActivity({
      userId: req.user.userId,
      userName: supervisor.firstName,
      userRole: req.user.accountType,
      accountNumber: supervisor.accountNumber,
      action: "SUPERVISOR_APPROVE_TRANSACTION",
      message: `Supervisor approved transaction ID: ${transactionId}`,
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

    const supervisor = await User.findById(req.user.userId);

    await logActivity({
      userId: req.user.userId,
      userName: supervisor.firstName,
      userRole: req.user.accountType,
      accountNumber: supervisor.accountNumber,
      action: "SUPERVISOR_REJECT_TRANSACTION",
      message: `Transaction ${transactionId} rejected`,
      req
    });

    res.json({ success: true, transaction });
  } catch (error) {
    console.error("Reject transaction error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
});

module.exports = router;
