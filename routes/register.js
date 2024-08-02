const express = require("express");
const { validator, body } = require("express-validator");
const validate = require("../middleware/validation").validatecreateuser;
const router = express.Router();
const user = require("../model/User");
const bcrypt = require("bcrypt");
router.post(
  "/register",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email format"),
    body("address").notEmpty().withMessage("Address is required"),
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
    body("name")
      .notEmpty()
      .withMessage("name is required.")
      .isLength({ min: 3 })
      .withMessage("name must be atleast 3 characters long")
      .trim(),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password, address } = req.body;

      const CheckEmail = await user.findOne({ email });

      if (CheckEmail) {
        return res.status(400).json({
          success: false,
          message: { email: ["Email Already Exists"] },
        });
      }
      const User = {};
      const salt = await bcrypt.genSalt(10);
      let secpassword = await bcrypt.hash(password, salt);
      User["name"] = name;
      User["address"] = address;
      User["email"] = email;
      User["password"] = secpassword;
      await user
        .create(User)
        .then(() => {
          res.status(201).json({
            success: true,
            message: { usercreation: ["you created account successfully"] },
          });
        })
        .catch(() => {
          res.status(500).json({
            success: false,
            message: { servererror: ["Internal Server Error"] },
          });
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: { servererror: ["Internal Server Error"] },
      });
    }
  }
);
module.exports = router;
