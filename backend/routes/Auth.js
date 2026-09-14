const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");
const checkAuth = require("../middleware/checkAuth");
const checkRole = require("../middleware/checkRole");

// register route:
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checking if email already exists
    const existingUser = await User.findOne({
      email: email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const newUser = await user.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// login route:
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // First check admin
    const admin = await Admin.findOne({
      username: identifier,
    });

    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      const accessToken = jwt.sign(
        {
          userId: admin._id,
          usertype: "admin",
        },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "15m",
        },
      );

      const refreshToken = jwt.sign(
        {
          userId: admin._id,
          usertype: "admin",
        },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "7d",
        },
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.json({
        message: "Admin login successful",
        user: {
          username: admin.username,
          usertype: "admin",
        },
      });
    }

    // If not admin, check normal user
    const user = await User.findOne({
      email: identifier,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        usertype: "user",
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        usertype: "user",
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({
      message: "User login successful",
      user: {
        name: user.name,
        email: user.email,
        usertype: "user",
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// refresh token route:
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
        usertype: decoded.usertype,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      message: "Access token refreshed",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
});

// logout route:
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({
    message: "Logout successful",
  });
});

// users count:
router.get("/count", checkAuth, checkRole(["admin"]), async (req, res) => {
  try {
    const count = await User.countDocuments();

    res.json({
      count: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user count",
    });
  }
});

// me route:

router.get("/me", checkAuth, async (req, res) => {
  try {
    if (req.user.usertype === "admin") {
      const admin = await Admin.findById(req.user.userId).select("-password");

      return res.json({
        user: {
          ...admin.toObject(),
          usertype: "admin",
        },
      });
    }

    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      user: {
        ...user.toObject(),
        usertype: "user",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get current user",
    });
  }
});

module.exports = router;
