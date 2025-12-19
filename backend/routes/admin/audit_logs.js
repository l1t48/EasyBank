/*
    | Method | Endpoint             | Auth Required | Roles | Description                  |
    |--------|--------------------  |---------------|-------|------------------------------|
    | GET    | /api/admin/audit-logs| Yes           | Admin | View system audit logs       |
*/

const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const User = require("../../models/User");
const ActivityLog = require('../../models/ActivityLog');
const logActivity = require("../../utils/Activitylogger");
const { MINIMUM_LIMIT_FOR_AUDIT_LOGS, INTERNAL_SERVER_ERROR} = require("../../config/global_variables")

router.use(authMiddleware);
router.use(authorizeRoles("Admin"));

router.get('/audit-logs', authMiddleware, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || MINIMUM_LIMIT_FOR_AUDIT_LOGS;
        const { accountNumber, role, startDate, endDate } = req.query;
        const filter = {};
        if (role) filter.userRole = role;
        if (accountNumber) filter.accountNumber = accountNumber;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }
        const logs = await ActivityLog.find(filter)
            .sort({ date: -1 })
            .limit(limit);
        const admin = await User.findById(req.user.userId);
        await logActivity({
            userId: admin._id,
            userName: admin.firstName,
            userRole: req.user.accountType,
            accountNumber: admin.accountNumber,
            action: 'ADMIN_VIEW_SYSTEM_LOGS',
            message: 'Admin viewed system logs',
            req
        });
        res.json({ success: true, logs });
    } catch (err) {
        console.error('Admin audit logs error:', err);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
    }
});

module.exports = router;