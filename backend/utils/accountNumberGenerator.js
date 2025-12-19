// | Function Name          | Description                                                            |
// |------------------------|------------------------------------------------------------------------|
// | generateAccountNumber | Generates a random 10-character alphanumeric account number (A–Z, 0–9) |

const {CHARS, ACCOUNT_NUMBER_LENGTH} = require("../config/global_variables")

function generateAccountNumber() {
  const length = ACCOUNT_NUMBER_LENGTH;
  const chars = CHARS;
  let accountNumber = '';
  for (let i = 0; i < length; i++) {
    accountNumber += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return accountNumber;
}

module.exports = generateAccountNumber;