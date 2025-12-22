/*
| Endpoint                           | Method | Auth Required | Roles   | Description                                                                |
|------------------------------------|--------|---------------|---------|----------------------------------------------------------------------------|
| /api/data/accountNumbers           | POST   | Yes           | Any     | Returns account numbers for a list of user IDs.                            |
| /api/data/accountNumber/:id        | GET    | Yes           | Any     | Returns the account number for a single user by ID.                        |
| /api/data/names-by-accounts        | POST   | No            | Any     | Returns first name, last name, and full name for a list of account numbers.|
| /api/data/names                    | POST   | Yes           | Any     | Returns first name, last name, and full name for multiple user IDs (array).|
| /api/data/accountNumbers           | POST   | Yes           | Any     | Returns account numbers for multiple user IDs (array).                     |

*/

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const User = require("../../models/User");
const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = require("../../config/global_variables");

router.use(authMiddleware);

router.get("/accountNumber/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(BAD_REQUEST).json({ success: false, error: "Invalid user ID" });
    }

    const user = await User.findById(id).select("accountNumber");
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, error: "User not found" });
    }

    return res.json({
      success: true,
      userId: id,
      accountNumber: user.accountNumber,
    });
  } catch (error) {
    console.error("Get account number error:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, error: "Server error" });
  }
});


// router.post("/names-by-accounts", async (req, res) => {
router.post("/names-by-accounts", authMiddleware, async (req, res) => {
  const { accountNumbers } = req.body;

  if (!Array.isArray(accountNumbers) || accountNumbers.length === 0) {
    return res.status(BAD_REQUEST).json({ success: false, error: "No account numbers provided" });
  }

  try {
    const users = await User.find({ accountNumber: { $in: accountNumbers } });

    const results = accountNumbers.map((acc) => {
      const user = users.find((u) => u.accountNumber === acc);
      if (!user) return { accountNumber: acc, found: false };
      return {
        accountNumber: acc,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        found: true,
      };
    });

    res.json({ success: true, results });
  } catch (err) {
    console.error("Error fetching users by account numbers:", err);
    res.status(INTERNAL_SERVER_ERROR).json({ success: false, error: "Server error" });
  }
});


router.post("/names", authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(BAD_REQUEST).json({
        success: false,
        error: "Body must include a non-empty 'ids' array",
      });
    }

    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return res.status(BAD_REQUEST).json({
        success: false,
        error: "No valid user IDs provided",
      });
    }

    const users = await User.find({ _id: { $in: validIds } }).select(
      "firstName lastName"
    );

    const map = {};
    users.forEach((u) => {
      map[u._id.toString()] = {
        firstName: u.firstName,
        lastName: u.lastName,
        fullName: `${u.firstName} ${u.lastName}`,
      };
    });

    const results = ids.map((id) => ({
      id,
      firstName: map[id]?.firstName || null,
      lastName: map[id]?.lastName || null,
      fullName: map[id]?.fullName || null,
      found: !!map[id],
    }));

    return res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Get multiple user names error:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, error: "Server error" });
  }
});

router.post("/accountNumbers", authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(BAD_REQUEST).json({
        success: false,
        error: "Body must include a non-empty 'ids' array",
      });
    }

    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return res.status(BAD_REQUEST).json({
        success: false,
        error: "No valid user IDs provided",
      });
    }

    const users = await User.find({ _id: { $in: validIds } }).select(
      "accountNumber"
    );

    const map = {};
    users.forEach((u) => {
      map[u._id.toString()] = u.accountNumber;
    });

    const results = ids.map((id) => ({
      id,
      accountNumber: map[id] || null,
      found: !!map[id],
    }));

    return res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Get multiple account numbers error:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({ success: false, error: "Server error" });
  }
});



module.exports = router;