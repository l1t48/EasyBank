/*
| Endpoint                     | Method | Auth Required | Roles | Description                                                                 |
|------------------------------|--------|---------------|-------|-----------------------------------------------------------------------------|
| /api/user/my-account         | GET    | Yes           | User  | Returns authenticated user account details and latest 10 transactions      |
| /api/user/update-profile     | PATCH  | Yes           | User  | Updates user profile information (first name, last name, email)            |
| /api/user/change-password    | PATCH  | Yes           | User  | Allows user to change password after validating old password and rules     |
*/

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../../models/User");
const Transaction = require("../../models/Transaction");
const logActivity = require('../../utils/Activitylogger');
const hashPassword = require('../../utils/hashPassword');
const validatePasswordChange = require("../../middlewares/validatePasswordReset");
const authMiddleware = require("../../middlewares/authMiddleware");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const { RECENT_TRANSACTIONS_LIMIT, BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR, NOT_FOUND } = require("../../config/global_variables")

router.use(authMiddleware);
router.use(authorizeRoles("User"));

router.get("/my-account", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(UNAUTHORIZED).json({ message: "Unauthorized: missing user id" });
    }
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    const recentTransactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(RECENT_TRANSACTIONS_LIMIT)
      .select("transactionType amount state createdAt approvedBy");
    const accountDetails = {
      userId: user._id,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      accountNumber: user.accountNumber || null,
      accountType: user.accountType,
      balance: user.balance ?? 0,
      createdAt: user.createdAt,
      latestTransactionType: user.latestTransactionType || null,
      recentTransactions
    };
    await logActivity({
      userId: user._id,
      userName: user.firstName,
      userRole: user.accountType,
      accountNumber: user.accountNumber,
      action: 'USER_VIEW_ACCOUNT',
      message: 'Viewed account details',
      req
    });
    res.json({ accountDetails });
  } catch (error) {
    console.error("GET /api/user/my-account error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
});

router.patch("/update-profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const allowedUpdates = ["firstName", "lastName", "email"];
    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key]) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(BAD_REQUEST).json({ error: "No valid fields provided" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true, select: "-passwordHash" }
    );
    if (!updatedUser) {
      return res.status(BAD_REQUEST).json({ error: "User not found" });
    }
    await logActivity({
      userId: updatedUser._id,
      userName: updatedUser.firstName,
      userRole: updatedUser.accountType,
      accountNumber: updatedUser.accountNumber,
      action: 'USER_UPDATE_PROFILE',
      message: `Updated profile fields: ${Object.keys(updates).join(", ")}`,
      req
    });
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
});

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
      action: 'USER_CHANGE_PASSWORD',
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