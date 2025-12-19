// | Function Name   | Description                                           |
// |-------------------|-------------------------------------------------------|
// | hashPassword      | Hashes a given password using bcrypt with 10 salt rounds |

const {SALTROUNDS} = require("../config/global_variables")

const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = SALTROUNDS;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = hashPassword;