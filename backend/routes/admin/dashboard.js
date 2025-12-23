/*
    | Endpoint             | Method | Auth Required | Roles | Description                                                   |
    |----------------------|--------|---------------|-------|---------------------------------------------------------------|
    | /api/dashboard/admin | GET    | Yes           | Admin | Returns admin dashboard                                       |
*/

const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Transaction = require("../../models/Transaction");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const authMiddleware = require("../../middlewares/authMiddleware");
const {ONE_DAY, INTERNAL_SERVER_ERROR, SEVEN_DAYS, HOUR_AMOUNT_PER_DAY, MIN_AMOUNT_PER_HOUR, SEC_AMOUNT_PER_MIN, MS_AMOUNT_PER_SEC} = require("../../config/global_variables");

router.use(authMiddleware); 

router.get("/admin", authorizeRoles("Admin"), async (req, res) => {
    try {
        const now = new Date();
        const oneDayAgo = new Date(now - ONE_DAY * HOUR_AMOUNT_PER_DAY * MIN_AMOUNT_PER_HOUR * SEC_AMOUNT_PER_MIN * MS_AMOUNT_PER_SEC);
        const sevenDaysAgo = new Date(now - SEVEN_DAYS * HOUR_AMOUNT_PER_DAY * MIN_AMOUNT_PER_HOUR * SEC_AMOUNT_PER_MIN * MS_AMOUNT_PER_SEC);
        const totalUsers = await User.countDocuments({ accountType: "User" });
        const totalAdmins = await User.countDocuments({ accountType: "Admin" });
        const totalSupervisors = await User.countDocuments({ accountType: "Supervisor" });
        const usersLastDay = await User.countDocuments({ accountType: "User", createdAt: { $gte: oneDayAgo } });
        const usersLast7Days = await User.countDocuments({ accountType: "User", createdAt: { $gte: sevenDaysAgo } });
        const totalTransactions = await Transaction.countDocuments();
        const transactionsByType = await Transaction.aggregate([
            { $group: { _id: "$transactionType", count: { $sum: 1 } } }
        ]);
        const transactionsByState = await Transaction.aggregate([
            { $group: { _id: "$state", count: { $sum: 1 } } }
        ]);
        res.json({
            dashboard: {
                totalUsers,
                totalAdmins,
                totalSupervisors,
                usersLastDay,
                usersLast7Days,
                totalTransactions,
                transactionsByType,
                transactionsByState
            }
        });
    } catch (error) {
        console.error("GET /dashboard/admin error:", error);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
});

module.exports = router;
