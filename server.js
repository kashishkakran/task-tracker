require("dotenv").config();   // MUST be first

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Task Tracker API is running");
});

const PORT = process.env.PORT || 5000;

// ✅ FIX IS HERE (MONGODB_URI, not MONGO_URI)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

