// | Function Name     | Description                                                                                               |
// |----------------   |-------------------------------------------------------------------------------------------------          |
// | randomAlphaNum    | Generate a TransactionsId for each transactions                                                           |

const crypto = require("crypto");

const { _36BYTES, RANDOM_STRING_LENGTH, DATE_PAD_LENGTH } = require("../config/global_variables");

function randomAlphaNum(length = RANDOM_STRING_LENGTH) {
  const bytes = crypto.randomBytes(length);
  return bytes.toString("base64").replace(/[^A-Z0-9]/gi, "").substring(0, length).toUpperCase() || Math.random().toString(_36BYTES).substring(2, 2+length).toUpperCase();
}

function formatDateYYYYMMDD(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(DATE_PAD_LENGTH, "0");
  const d = String(date.getDate()).padStart(DATE_PAD_LENGTH, "0");
  return `${y}${m}${d}`;
}

function generateTransactionId() {
  return `TXN-${formatDateYYYYMMDD()}-${randomAlphaNum(RANDOM_STRING_LENGTH)}`;
}

module.exports = generateTransactionId;
