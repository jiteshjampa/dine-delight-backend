const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderItemSchema = new Schema({
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
  date: { type: Date, default: new Date() },
});

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderlist: {
      type: [orderItemSchema],
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);
