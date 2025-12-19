// | Middleware Name | Description |
// |-----------------|-------------|
// | CORS Middleware | Configures allowed origins, methods, and credentials using environment variables for secure cross-origin requests |

require('dotenv').config();
const cors = require("cors");

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(","),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

module.exports = cors(corsOptions);
