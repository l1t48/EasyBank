/*
  | Endpoint                       | Method | Auth Required | Roles  | Description                                      |
  | ------------------------------ | ------ | ------------- | ------ | ------------------------------------------------ |
  | /api/admin/all-users           | GET    | Yes           | Admin  | Get all users and their details                 |
  | /api/admin/user/:accountNumber | GET    | Yes           | Admin  | Get details of a specific user                  |
  | /api/admin/create-user         | POST   | Yes           | Admin  | Create a new user with any role                 |
  | /api/admin/update-user/:id     | PATCH  | Yes           | Admin  | Update user information or roles                |
  | /api/admin/delete-user/:id     | DELETE | Yes           | Admin  | Delete a user                                   |
*/

const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const User = require("../../models/User");
const logActivity = require("../../utils/Activitylogger");
const generateAccountNumber = require('../../utils/accountNumberGenerator');
const validateUserRegistrationInput = require('../../utils/inputValidation');
const hashPassword = require('../../utils/hashPassword');
const { validateRegister, validateUserUpdate } = require("../../middlewares/validateInput")
const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, CREATED } = require("../../config/global_variables");

router.use(authMiddleware);
router.use(authorizeRoles("Admin"));

router.get("/all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const admin = await User.findById(req.user.userId);
    await logActivity({
      userId: admin._id,
      userName: admin.firstName,
      userRole: admin.accountType,
      accountNumber: admin.accountNumber,
      action: "ADMIN_VIEW_ALL_USERS",
      message: "Admin viewed all users and their details",
      req
    });
    res.json({ success: true, users });
  } catch (error) {
    console.error("All users error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
});

router.get("/admin/:accountNumber", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.params.accountNumber });
    if (!user) return res.status(NOT_FOUND).json({ error: "User not found" });
    const admin = await User.findById(req.user.userId);
    await logActivity({
      userId: admin._id,
      userName: admin.firstName,
      userRole: admin.accountType,
      accountNumber: admin.accountNumber,
      action: "ADMIN_VIEW_USER",
      message: `Admin viewed details of user ${user.firstName} ${user.lastName} (Account: ${user.accountNumber})`,
      req
    });
    res.json({ success: true, user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
});

router.post("/create-user", authMiddleware, validateRegister, async (req, res) => {
  try {
    const validationError = validateUserRegistrationInput(req.body);
    if (validationError) {
      return res.status(BAD_REQUEST).json({ error: validationError });
    }
    const { firstName, lastName, email, password, accountType } = req.body;
    const allowedRoles = ["User", "Admin", "Supervisor"];
    if (!allowedRoles.includes(accountType)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid account type" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(BAD_REQUEST).json({ error: "Email is already registered" });
    }
    let accountNumber;
    let isUnique = false;
    while (!isUnique) {
      accountNumber = generateAccountNumber();
      const existingAccount = await User.findOne({ accountNumber });
      if (!existingAccount) {
        isUnique = true;
      }
    }
    const passwordHash = await hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      accountNumber,
      accountType,
      balance: 0,
      latestTransactionType: null
    });
    await newUser.save();
    const admin = await User.findById(req.user.userId);
    await logActivity({
      userId: req.user.userId,
      userName: admin.firstName,
      userRole: req.user.accountType,
      accountNumber: admin.accountNumber,
      action: "ADMIN_CREATE_USER",
      message: `Admin created a new user: ${email} with role ${accountType}`,
      req
    });
    res.status(CREATED).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
});

router.patch("/update-user/:id", authMiddleware, validateUserUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, accountType, balance, password } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User not found" });
    }
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(BAD_REQUEST).json({ error: "Email is already registered" });
      }
      user.email = email;
    }
    if (password) {
      user.passwordHash = await hashPassword(password);
      user.tokenVersion = (user.tokenVersion || 0) + 1;
    }
    const allowedRoles = ["User", "Admin", "Supervisor"];
    if (accountType && !allowedRoles.includes(accountType)) {
      return res.status(BAD_REQUEST).json({ error: "Invalid account type" });
    }
    if (firstName)
      user.firstName = firstName;
    if (lastName)
      user.lastName = lastName;
    if (accountType)
      user.accountType = accountType;
    if (balance !== undefined)
      user.balance = balance;
    await user.save();
    const admin = await User.findById(req.user.userId);
    await logActivity({
      userId: req.user.userId,
      userName: admin.firstName,
      userRole: req.user.accountType,
      accountNumber: admin.accountNumber,
      action: "ADMIN_UPDATE_USER",
      message: `Admin updated user ${user.email}`,
      req
    });
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
});

router.delete("/delete-user/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(NOT_FOUND).json({ error: "User not found" });
    }
    await User.findByIdAndDelete(id);
    const admin = await User.findById(req.user.userId);
    await logActivity({
      userId: req.user.userId,
      userName: admin.firstName,
      userRole: req.user.accountType,
      accountNumber: admin.accountNumber,
      action: "ADMIN_DELETE_USER",
      message: `Admin deleted user ${user.email}`,
      req
    });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
});

module.exports = router;
