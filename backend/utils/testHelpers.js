// | Function Name | Description |
// |----------------|-------------|
// | resetLimiter   | Resets the rate limit counter for a given key in the loginLimiter middleware |


const loginLimiter = require("../middlewares/validateInput");

async function resetLimiter(key) {
  if (loginLimiter && loginLimiter.store && loginLimiter.store.resetKey) {
    loginLimiter.store.resetKey(key);
  }
}

module.exports = { resetLimiter };
