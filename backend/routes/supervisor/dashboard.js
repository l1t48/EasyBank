/**
 | Endpoint                  | Method | Auth Required | Roles       | Description                                                     |
 |---------------------      |--------|---------------|-------------|----------------------------------------------------------       |
 | /api//dashboard/supervisor| GET    | Yes           | Supervisor  | Returns supervisor dashboard: counts and recent reported issues |
*/

const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const Transaction = require("../../models/Transaction");

const authorizeRoles = require("../../middlewares/roleMiddleware");
const authMiddleware = require("../../middlewares/authMiddleware");

const {INTERNAL_SERVER_ERROR} = require("../../config/global_variables");

router.use(authMiddleware);

router.get("/supervisor", authorizeRoles("Supervisor"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ accountType: "User" });
    const totalTransactions = await Transaction.countDocuments();

    const transactionsByState = await Transaction.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 } } },
    ]);

    const transactionsByType = await Transaction.aggregate([
      { $group: { _id: "$transactionType", count: { $sum: 1 } } },
    ]);

    const recentTransactions = await Transaction.find()
      .populate("userId", "firstName lastName accountNumber")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      dashboard: {
        totalUsers,
        totalTransactions,
        transactionsByState,
        transactionsByType,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error("GET /dashboard/supervisor error:", error);
    res.status( INTERNAL_SERVER_ERROR ).json({ message: "Server error" });
  }
});

module.exports = router;
