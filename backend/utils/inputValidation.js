// | Function Name                     | Description                                      |
// |-------------------------------------|--------------------------------------------------|
// | validateUserRegistrationInput      | Validates user registration input, ensuring all required fields (firstName, lastName, email, password) are provided |

const {MINIMUM_ALLOWED_LENGTH_PASSWORD} = require("../config/global_variables")

function validateUserRegistrationInput(data) {
  const { firstName, lastName, email, password, accountType } = data;
  if (!firstName || !lastName || !email || !password) {
    return "Missing required fields";
  }
  if (password.length < MINIMUM_ALLOWED_LENGTH_PASSWORD) {
    return "Password must be at least 8 characters";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[@$!%*?&]/.test(password)) {
    return "Password must contain at least one special character (@$!%*?&)";
  }
  const allowedRoles = ["User", "Admin", "Supervisor"];
  if (!allowedRoles.includes(accountType)) {
    return "Invalid account type";
  }
  return null;
}

module.exports = validateUserRegistrationInput;