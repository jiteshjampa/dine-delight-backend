const express = require("express");
const jwt = require("jsonwebtoken");
const route = express.Router();
const JWT_SECRET = process.env.ACCESS_SECRET;

// Route to check the token
route.post("/check", (req, res) => {
  const token = req.cookies.authToken; // Extract the token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Failed to authenticate token" });
    }

    // If token is valid, you can use the decoded information as needed
    res.json({ success: true, message: "Token is valid", user: decoded });
  });
});

module.exports = route;
