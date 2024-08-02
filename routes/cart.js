// routes/cart.js
const express = require("express");
const router = express.Router();
const UserDetail = require("../model/UserDetail");
const { verifyauthtoken } = require("../middleware/validation");

// Add or update item in cart
// Add or update item in cart
router.post("/update-cart", verifyauthtoken, async (req, res) => {
  const { itemname, quantity, cost } = req.body;
  const userId = req.payload._id;
  try {
    let user = await UserDetail.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let cartItem = user.cartitems.find(
      (item) => item.itemname.toLowerCase() === itemname.toLowerCase()
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cartitems.push({ itemname, quantity, cost });
    }

    await user.save();

    res.status(200).json({ message: "Item added to cart", user });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Get all items in the cart
router.get("/cart", verifyauthtoken, async (req, res) => {
  try {
    const user = await UserDetail.findOne({ userId: req.payload._id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ cartitems: user.cartitems });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cart items" });
  }
});

router.put("/cart/increment", verifyauthtoken, async (req, res) => {
  try {
    const { itemname } = req.body;
    const user = await UserDetail.findOne({ userId: req.payload._id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItem = user.cartitems.find(
      (item) => item.itemname.toLowerCase() === itemname.toLowerCase()
    );

    if (cartItem) {
      cartItem.quantity += 1;
      await user.save();
      return res
        .status(200)
        .json({ message: "Item quantity increased", cartItem });
    } else {
      return res.status(404).json({ error: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error incrementing item quantity:", error);
    res.status(500).json({ error: "Failed to update item quantity" });
  }
});

// Decrement item quantity in the cart
router.put("/cart/decrement", verifyauthtoken, async (req, res) => {
  try {
    const { itemname } = req.body;
    let user = await UserDetail.findOne({ userId: req.payload._id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let cartItem = user.cartitems.find(
      (item) => item.itemname.toLowerCase() === itemname.toLowerCase()
    );

    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await user.save();
        return res
          .status(200)
          .json({ message: "Item quantity decreased", cartItem });
      } else {
        return res
          .status(400)
          .json({ error: "Cannot decrease quantity below 1" });
      }
    } else {
      return res.status(404).json({ error: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error decrementing item quantity:", error);
    res.status(500).json({ error: "Failed to update item quantity" });
  }
});

// Remove item from cart

// Delete an item from the cart
router.delete("/delete-item", verifyauthtoken, async (req, res) => {
  const { itemname } = req.body;

  if (!itemname) {
    return res.status(400).json({ error: "Item name is required" });
  }

  try {
    // Find the user by userId
    const user = await UserDetail.findOne({ userId: req.payload._id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter out the item to delete
    const updatedCartItems = user.cartitems.filter(
      (item) => item.itemname.toLowerCase() !== itemname.toLowerCase()
    );

    if (updatedCartItems.length === user.cartitems.length) {
      // No item was removed
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Update the user's cart with the filtered items
    user.cartitems = updatedCartItems;

    await user.save(); // Save the updated user document

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).json({ error: "Failed to remove item from cart" });
  }
});
// Example: /api/user endpoint
router.get("/user", verifyauthtoken, async (req, res) => {
  try {
    const user = await UserDetail.findOne({ userId: req.payload._id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ cartValue: user.cartitems.length });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

module.exports = router;
