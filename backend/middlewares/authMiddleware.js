// | Middleware Name | Description |
// |-----------------|-------------|
// | authMiddleware  | Verifies JWT from the Authorization header, attaches decoded user info to `req.user`, and blocks unauthorized or invalid requests |

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { UNAUTHORIZED, FORBIDDEN } = require("../config/global_variables");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) 
    return res.status(UNAUTHORIZED).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); 
  } 
  catch (err) {
    return res.status(FORBIDDEN).json({ error: "Invalid or expired token." });
  }
}

module.exports = authMiddleware;
