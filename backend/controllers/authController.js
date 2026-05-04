const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================
// 🔐 SIGNUP
// ======================
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields required",
    });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err) => {
        if (err) {
          console.log(err);

          // Handle duplicate email
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              message: "User already exists",
            });
          }

          return res.status(500).json({
            message: "Signup failed",
          });
        }

        return res.status(201).json({
          message: "User registered successfully ✅",
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================
// 🔐 LOGIN
// ======================
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Server error",
        });
      }

      // User not found
      if (results.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = results[0];

      try {
        // Compare password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.status(401).json({
            message: "Wrong password",
          });
        }

        // Generate JWT
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        // Send token
        return res.status(200).json({
          token,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "Login failed",
        });
      }
    }
  );
};