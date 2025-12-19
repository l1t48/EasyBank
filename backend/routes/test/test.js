/*
| Endpoint          | Method | Auth Required | Roles | Description                  |
|-------------------|--------|---------------|-------|------------------------------|
| /api/test/ping    | GET    | No            | Public| Simple health check endpoint |
*/

const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.json({ message: "Backend is working!" });
});

module.exports = router;