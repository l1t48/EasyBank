/*
| Endpoint                     | Method | Auth Required | Roles  | Description                                      |
|------------------------------|--------|---------------|--------|--------------------------------------------------|
| /api/auth/register-new-user  | POST   | No            | Public | Registers a new user account                     |
*/

const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const generateAccountNumber = require('../../utils/accountNumberGenerator');
const hashPassword = require('../../utils/hashPassword');
const logActivity = require('../../utils/Activitylogger');
const { validateRegister } = require("../../middlewares/validateInput");
const { registerLimiter } = require("../../middlewares/rateLimiter");
const { CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../../config/global_variables");

router.post('/register-new-user', registerLimiter, validateRegister, async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
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
            accountType: "User",
            balance: 0,
            latestTransactionType: null
        });
        await newUser.save();
        await logActivity({
            userId: newUser._id,
            userName: newUser.firstName,
            userRole: newUser.accountType,
            accountNumber: newUser.accountNumber,
            action: 'USER_REGISTER',
            message: 'New user registered',
            req
        });
        res.status(CREATED).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
});

module.exports = router;