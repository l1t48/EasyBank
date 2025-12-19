// | Middleware Function | Purpose                                                                 |
// |---------------------|-------------------------------------------------------------------------|
// | authorizeRoles      | Restricts access to specified roles; denies if user missing or role not allowed |

const { UNAUTHORIZED, FORBIDDEN } = require("../config/global_variables")

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(UNAUTHORIZED).json({ error: "Unauthorized" });
    }
    if (!roles.includes(req.user.accountType)) {
      return res.status(FORBIDDEN).json({ error: "Forbidden: insufficient privileges" });
    }
    next();
  };
}

module.exports = authorizeRoles;
