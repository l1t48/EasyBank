/*
| Endpoint            | Method | Auth Required | Roles       | Description                                                           |
|---------------------|--------|---------------|-------------|----------------------------------------------------------             |
| /dashboard/user     | GET    | Yes           | User        | Returns user dashboard: account details, transactions, totals by type |
*/

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../../models/User");
const Transaction = require("../../models/Transaction");

const authorizeRoles = require("../../middlewares/roleMiddleware");
const authMiddleware = require("../../middlewares/authMiddleware");

const { UNAUTHORIZED, INTERNAL_SERVER_ERROR, NOT_FOUND } = require("../../config/global_variables");

router.use(authMiddleware); 


router.get("/user", authorizeRoles("User"), async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });

        const user = await User.findById(userId).select("-passwordHash");
        if (!user) return res.status(NOT_FOUND).json({ message: "User not found" });

        const transactionsCount = await Transaction.countDocuments({ userId });
        const recentTransactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("transactionType amount state createdAt updatedAt");

        const aggregationResult = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), state: "Approved" } },
            { $group: { _id: "$transactionType", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);

        const totalsByType = {};
        aggregationResult.forEach(item => {
            totalsByType[item._id] = { totalAmount: item.totalAmount, count: item.count };
        });

        const dashboard = {
            accountNumber: user.accountNumber || null,
            balance: user.balance ?? 0,
            latestTransactionType: user.latestTransactionType || null,
            createdAt: user.createdAt || null,
            transactionsCount,
            recentTransactions,
            totalsByType
        };

        res.json({ dashboard });
    } catch (error) {
        console.error("GET /dashboard/user error:", error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
});

module.exports = router;
