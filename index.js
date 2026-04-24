const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const authRoute = require("./routes/auth");
const todoRoute = require("./routes/todo");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("Database connected");
}

// Middleware: ensure DB is connected before handling any API request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/auth", authRoute);
app.use("/todos", todoRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("Server started at port:", PORT));
}

module.exports = app;
