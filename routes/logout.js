// routes/logout.js
const express = require("express");
const router = express.Router();

router.delete("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
