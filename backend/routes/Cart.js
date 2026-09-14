const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const checkAuth = require("../middleware/checkAuth");
const Post = require("../models/Post");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const User = require("../models/User");
const transporter = require("../utils/email");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/", checkAuth, async (req, res) => {
  try {
    const { postId } = req.body;
    // Check whether selected post is already in cart
    const existingItem = await Cart.findOne({
      userId: req.user.userId,
      postId: postId,
    });

    if (existingItem) {
      return res.status(409).json({
        message: "Post is already in cart",
      });
    }

    const cartItem = new Cart({
      userId: req.user.userId,
      postId: postId,
      quantity: 1,
    });

    const newCartItem = await cartItem.save();

    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.get("/", checkAuth, async (req, res) => {
  try {
    // const cartItems = await Cart.find().populate("postId");
    const cartItems = await Cart.find({
      userId: req.user.userId,
    }).populate("postId");
    //populate(postId) gives like:{
    //   "_id": "cart123",
    //->   "postId": {
    //     "_id": "68c123...",
    //     "title": "How Databases Work",
    //     "image": "https://...",
    //     "price": 550
    //   },
    //   "quantity": 1
    // }

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      message: "Cart item removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// create payment order:
router.post("/create-order", checkAuth, async (req, res) => {
  try {
    const cartItems = await Cart.find({
      userId: req.user.userId,
    }).populate("postId");

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    cartItems.forEach((item) => {
      totalAmount += item.postId.price * item.quantity;
    });

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to create payment order",
    });
  }
});

router.post("/verify-payment", checkAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // 1. Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    // 2. Get only this user's cart
    const cartItems = await Cart.find({
      userId: req.user.userId,
    }).populate("postId");

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // 3. Prepare purchased items
    const orderItems = cartItems.map((item) => ({
      postId: item.postId._id,
      title: item.postId.title,
      price: item.postId.price,
      quantity: item.quantity,
    }));

    // 4. Calculate total
    const totalAmount = cartItems.reduce((total, item) => {
      return total + item.postId.price * item.quantity;
    }, 0);

    // 5. Create order
    const order = new Order({
      userId: req.user.userId,
      items: orderItems,
      totalAmount: totalAmount,
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    await order.save();

    const itemsHtml = orderItems
      .map(
        (item) => `
      <li>
        ${item.title} - Rs. ${item.price} × ${item.quantity}
      </li>
    `,
      )
      .join("");

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      // to: process.env.SMTP_USER,
      subject: "Payment Successful - My Blog",
      html: `
    <h2>Payment Successful</h2>

    <p>Hello ${user.name},</p>

    <p>Your payment was completed successfully.</p>

    <h3>Purchased Posts</h3>

    <ul>
      ${itemsHtml}
    </ul>

    <h3>Total Amount: Rs. ${totalAmount}</h3>

    <p>
      <strong>Payment Status:</strong> Paid
    </p>

    <p>
      <strong>Payment ID:</strong> ${razorpay_payment_id}
    </p>

    <p>Thank you for your purchase!</p>
  `,
    };
    console.log("Sending email to:", user.email);

    const emailInfo = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
    console.log("Message ID:", emailInfo.messageId);
    console.log("Accepted:", emailInfo.accepted);
    console.log("Rejected:", emailInfo.rejected);
    console.log("Response:", emailInfo.response);

    // 6. Clear only this user's cart
    await Cart.deleteMany({
      userId: req.user.userId,
    });

    res.json({
      message: "Payment successful",
      orderId: order._id,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Payment processing failed",
    });
  }
});

module.exports = router;
