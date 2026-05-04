const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// ✅ ROOT ROUTE FIRST
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ROUTES
const authRoutes = require("./routes/authRoutes");
const urlRoutes = require("./routes/urlRoutes");

app.use("/auth", authRoutes);
app.use("/", urlRoutes);

// SERVER
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});