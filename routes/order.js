const express = require("express");
const router = express.Router();
const UserDetail = require("../model/UserDetail");
const Order = require("../model/Order");
const { verifyauthtoken } = require("../middleware/validation");

router.post("/order", verifyauthtoken, async (req, res) => {
  try {
    const userId = req.payload._id;
    let user = await UserDetail.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let order = await Order.findOne({ userId });
    if (!order) {
      order = new Order({ userId, orderlist: [] });
    }

    order.orderlist.push(...user.cartitems);
    user.cartitems = []; // Clear the cart items

    await order.save();
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderitems: order.orderlist,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.get("/order", verifyauthtoken, async (req, res) => {
  try {
    const userId = req.payload._id;
    let orders = await Order.findOne({ userId });

    if (!orders) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this user." });
    }

    // Sort orderlist by date and time
    orders.orderlist.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by date
    const groupedOrders = orders.orderlist.reduce((acc, item) => {
      const date = new Date(item.date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      groupedOrderItems: groupedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
