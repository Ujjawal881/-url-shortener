const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROUTES
const authRoutes = require("./routes/authRoutes");
const urlRoutes = require("./routes/urlRoutes"); // 👈 ADD THIS

app.use("/auth", authRoutes);
app.use("/", urlRoutes); // 👈 ADD THIS

// ✅ SERVER
app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});