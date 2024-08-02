const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const validatecreateuser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => {
      if (!errorMessages[error.path]) {
        errorMessages[error.path] = [];
      }
      errorMessages[error.path].push(error.msg);
    });
    return res.status(400).json({ success: false, message: errorMessages });
  }
  next();
};
const verifyauthtoken = (req, res, next) => {
  if (!req.cookies.authToken) {
    if (req.url === "/login") {
      return next();
    }
    return res
      .status(401)
      .json({ success: false, message: "Access Denied. for u favorite" });
  }

  jwt.verify(
    req.cookies.authToken,
    process.env.ACCESS_SECRET,
    (err, payload) => {
      if (err) {
        return res.status(401).json({ success: false, message: err.name });
      }
      req.payload = payload;
      return next();
    }
  );
};

module.exports = { validatecreateuser, verifyauthtoken };
