// | Function Name | Description                                                                                                |
// |----------------|-------------------------------------------------------------------------------------------------          |
// | logActivity    | Logs a user activity with details such as userId, userName, userRole, action, message, IP, and user-agent |

const ActivityLog = require('../models/ActivityLog');

async function logActivity({ userId, userName, userRole, accountNumber , action, message, req }) {
  await ActivityLog.create({
    userId: userId || null,
    userName: userName || null,
    userRole: userRole || null,
    accountNumber: accountNumber || null,
    action,
    message,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
}

module.exports = logActivity;
