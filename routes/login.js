const express = require("express");
const route = express.Router();
const user = require("../model/User");
const userdetail = require("../model/UserDetail");
const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const orderdetail = require("../model/Order");
const {
  validatecreateuser,
  verifyauthtoken,
} = require("../middleware/validation");
const jwt = require("jsonwebtoken");
const generateauthtoken = (id) => {
  return new Promise((resolve, reject) => {
    const tokenid = {
      _id: id,
    };

    jwt.sign(
      tokenid,
      process.env.ACCESS_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
};
route.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .trim(),
  ],
  validatecreateuser,
  verifyauthtoken,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const CheckUser = await user.findOne({ email });

      if (!CheckUser) {
        return res
          .status(400)
          .json({ success: false, message: { email: ["Email is incorrect"] } });
      }
      const check = await bcrypt.compare(password, CheckUser.password);
      if (check) {
        const authtoken = await generateauthtoken(CheckUser._id);

        const cookieOptions = {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: true, // Ensure this is true when serving over HTTPS
          sameSite: "None",
        };
        res.cookie("authToken", authtoken, cookieOptions);
        let userDetails = await userdetail.findOne({ userId: CheckUser._id });
        if (!userDetails) {
          // Create user details if not found
          userDetails = await userdetail.create({
            userId: CheckUser._id,
            cartitems: [],
          });
        }
        let orderDetails = await orderdetail.findOne({ userId: CheckUser._id });
        if (!orderDetails) {
          // Create user details if not found
          orderDetails = await orderdetail.create({
            userId: CheckUser._id,
            orderlist: [],
          });
        }

        return res
          .status(200)
          .json({ sucess: true, message: "User Logged In" });
      } else {
        return res.status(400).json({
          sucess: false,
          message: { password: ["Password is incorrect"] },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: { servererror: ["Internal Server Error"] },
      });
    }
  }
);
module.exports = route;
