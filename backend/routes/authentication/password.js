/*
| Endpoint                        | Method | Auth Required | Roles  | Description                                             |
|---------------------------------|--------|---------------|--------|---------------------------------------------------------|
| /api/auth/forgot-password       | POST   | No            | Public | Sends a password reset link to the user's email         |
| /api/auth/reset-password/:token | POST   | No            | Public | Resets the user's password using a valid reset token    |
*/

const express = require("express");
const crypto = require("crypto");
const sendMail = require("../../utils/mailer");
const router = express.Router();
const User = require('../../models/User');
const hashPassword = require('../../utils/hashPassword');
const logActivity = require('../../utils/Activitylogger');
const validatePasswordReset = require('../../middlewares/validatePasswordReset')
const { _32BYTES, BAD_REQUEST, INTERNAL_SERVER_ERROR, PASSWORD_LIMIT_EXPIRESION, SEC_AMOUNT_PER_MIN, MS_AMOUNT_PER_SEC } = require("../../config/global_variables")

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user)
            return res.status(BAD_REQUEST).json({ error: "No account with that email" });

        const resetToken = crypto.randomBytes(_32BYTES).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = Date.now() + PASSWORD_LIMIT_EXPIRESION * SEC_AMOUNT_PER_MIN * MS_AMOUNT_PER_SEC;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendMail(
            user.email,
            "Password Reset Request",
            `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2c3e50;">Password Reset Request</h2>
                <p style="color: #2c3e50;">We received a request to reset your password. Click the button below to proceed:</p>
                <div style="margin: 20px 0;">
                    <a href="${resetUrl}" 
                    style="
                        display: inline-block;
                        padding: 12px 20px;
                        background-color: #A3D78A;
                        color: #2c3e50;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;">
                    Reset Password
                    </a>
                </div>
                <p style="font-size: 0.9em; color: #2c3e50;">This link will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
            </div>
            `
        );

        await logActivity({
            userId: user._id,
            userName: user.firstName,
            userRole: user.accountType,
            accountNumber: user.accountNumber,
            action: "USER_FORGOT_PASSWORD",
            message: "Password reset requested",
            req
        });

        res.json({ message: "Password reset link sent to your email" });

    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
});

router.post("/reset-password/:token", validatePasswordReset, async (req, res) => {
    try {
        const user = req.userForReset;
        const { newPassword } = req.body;

        user.passwordHash = await hashPassword(newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: "Password reset successful. You can now log in." });

        await logActivity({
            userId: user._id,
            userName: user.firstName,
            userRole: user.accountType,
            accountNumber: user.accountNumber,
            action: "USER_RESET_PASSWORD",
            message: "Password successfully reset",
            req
        });

    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
});


module.exports = router;