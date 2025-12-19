/*
| Endpoint                           | Method | Auth Required | Roles      | Description                                                                 |
|------------------------------------|--------|---------------|------------|-----------------------------------------------------------------------------|
| /api/supervisor/audit-logs         | GET    | Yes           | Supervisor | Retrieves system audit logs with optional filtering by role, account, and date |
*/

const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const logActivity = require('../../utils/Activitylogger');
const ActivityLog = require('../../models/ActivityLog');
const authMiddleware = require("../../middlewares/authMiddleware");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const { MINIMUM_LIMIT_FOR_AUDIT_LOGS, INTERNAL_SERVER_ERROR } = require("../../config/global_variables")

router.use(authMiddleware);
router.use(authorizeRoles("Supervisor"));

router.get('/audit-logs', authMiddleware, async (req, res) => {
  try {
    const { limit = MINIMUM_LIMIT_FOR_AUDIT_LOGS, accountNumber, role, startDate, endDate } = req.query;
    const query = { userRole: { $in: ['User', 'Supervisor'] } };

    if (req.user.accountType === 'Supervisor') {
      query.supervisorId = req.user._id;
    }

    if (accountNumber) query.accountNumber = accountNumber;
    if (role) query.userRole = role;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));


    const supervisor = await User.findById(req.user.userId);

    await logActivity({
      userId: supervisor._id,
      userName: supervisor.firstName,
      userRole: req.user.accountType,
      accountNumber: supervisor.accountNumber,
      action: 'SUPERVISOR_VIEW_SYSTEM_LOGS',
      message: 'Supervisor viewed system logs',
      req
    });

    res.json({ success: true, logs });
  } catch (err) {
    console.error('Supervisor audit logs error:', err);
    res.status(INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
  }
});

module.exports = router;
