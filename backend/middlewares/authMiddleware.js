// | Middleware Name | Description |
// |-----------------|-------------|
// | authMiddleware  | Verifies JWT from the Authorization header, attaches decoded user info to `req.user`, and blocks unauthorized or invalid requests |

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/User");
const { UNAUTHORIZED, FORBIDDEN } = require("../config/global_variables");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(UNAUTHORIZED).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (user && decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        code: "TOKEN_VERSION_MISMATCH",
        error: "Security update required. Please log in again."
      });
    }

    req.user = decoded;
    next();
  }
  catch (err) {
    return res.status(FORBIDDEN).json({ error: "Invalid or expired token." });
  }
}

module.exports = authMiddleware;
