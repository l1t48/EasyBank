/*
| Endpoint                | Method | Auth Required | Roles  | Description                                             |
|-------------------------|--------|---------------|--------|---------------------------------------------------------|
| /api/auth/login         | POST   | No            | Public | Authenticates a user and returns a JWT access token     |
*/

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require('../../models/User');
const logActivity = require('../../utils/Activitylogger');
const { validateLogin } = require("../../middlewares/validateInput");
const { loginLimiter } = require("../../middlewares/rateLimiter");
const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = require("../../config/global_variables");
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", loginLimiter, validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(UNAUTHORIZED).json({ error: "Invalid email or password" });
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch)
            return res.status(UNAUTHORIZED).json({ error: "Invalid email or password" });
        const token = jwt.sign(
            { userId: user._id, accountType: user.accountType, tokenVersion: user.tokenVersion },
            JWT_SECRET,
            { expiresIn: "30m" }
        );
        res.json({
            message: "Login successful",
            token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    accountType: user.accountType,
                    accountNumber: user.accountNumber,
                    balance: user.balance
                }
        });
        await logActivity({
            userId: user._id,
            userName: user.firstName,
            userRole: user.accountType,
            accountNumber: user.accountNumber,
            action: `${user.accountType.toLocaleUpperCase()}_LOGIN`,
            message: `${user.accountType} ${user.firstName} logged in `,
            req
        });
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
});

module.exports = router;