// models/UserDetail.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  itemname: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  cost: {
    type: Number,
    required: true,
  },
});

const userDetailSchema = new Schema(
  {
    userId: {
      type: String, // Adjust type based on your user ID
      required: true,
    },
    cartitems: {
      type: [cartItemSchema], // Array of cart items
      default: [], // Initialize as an empty array
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDetail", userDetailSchema);
