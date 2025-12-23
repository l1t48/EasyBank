/*
| Endpoint                                | Method | Auth Required | Roles      | Description                                                                 |
|-----------------------------------------|--------|---------------|------------|-----------------------------------------------------------------------------|
| /api/supervisor/change-password         | PATCH  | Yes           | Supervisor | Allows a supervisor to change their password after verifying the old password |
*/

const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const logActivity = require('../../utils/Activitylogger');
const authMiddleware = require("../../middlewares/authMiddleware");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const validatePasswordChange = require("../../middlewares/validatePasswordReset");
const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = require("../../config/global_variables");

router.use(authMiddleware);
router.use(authorizeRoles("Supervisor"));

router.patch("/change-password", authMiddleware, validatePasswordChange, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User not found." });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(BAD_REQUEST).json({ error: "Old password is incorrect." });
    }
    user.passwordHash = await hashPassword(newPassword);
    await user.save();
    await logActivity({
      userId: user._id,
      userName: user.firstName,
      userRole: user.accountType,
      accountNumber: user.accountNumber,
      action: 'SUPERVISOR_CHANGE_PASSWORD',
      message: 'Password successfully changed',
      req
    });
    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
});

module.exports = router;
