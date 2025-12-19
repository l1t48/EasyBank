// | Middleware Name   | Description |
// |-------------------|-------------|
// | Helmet Middleware | Enhances app security by setting HTTP headers, including a custom Content Security Policy for scripts, styles, images, and connections |

const helmet = require("helmet");

const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", process.env.BASE_URL],
    },
  },
});

module.exports = helmetMiddleware;