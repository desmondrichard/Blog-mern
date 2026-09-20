require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const postRoutes = require("./routes/Posts");
const cartRoutes = require("./routes/Cart");
const authRoutes = require("./routes/Auth");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8000;

app.set("trust proxy", 1);
// Middleware:
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json()); // for parsing application/json body-parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors());

// connect mongoDB:
mongoose
  // .connect("mongodb://localhost:27017/blog")
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

// use routes:
app.use("/api/posts", postRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
