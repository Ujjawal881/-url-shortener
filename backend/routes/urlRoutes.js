const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// 🔐 Helper: Verify Token
const verifyUser = (token) => {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};



// ✅ 1. SHORTEN URL
router.get("/shorten", (req, res) => {
  const { token, url } = req.query;

  if (!token) return res.status(400).send("Token required");
  if (!url) return res.status(400).send("URL required");

  const decoded = verifyUser(token);
  if (!decoded) return res.status(401).send("Invalid token");

  const userId = decoded.id;
  const shortCode = Math.random().toString(36).substring(2, 8);

  db.query(
    "INSERT INTO urls (short_code, long_url, user_id) VALUES (?, ?, ?)",
    [shortCode, url, userId],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("DB Error");
      }

      res.json({
        shortUrl: `http://localhost:5001/${shortCode}`,
      });
    }
  );
});



// ✅ 2. GET USER URLS
router.get("/myurls", (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).send("Token required");

  const decoded = verifyUser(token);
  if (!decoded) return res.status(401).send("Invalid token");

  db.query(
    "SELECT * FROM urls WHERE user_id = ? ORDER BY created_at DESC",
    [decoded.id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("DB Error");
      }

      res.json(results);
    }
  );
});



// ✅ 3. DELETE URL
router.get("/delete", (req, res) => {
  const { token, id } = req.query;

  if (!token || !id) return res.status(400).send("Missing data");

  const decoded = verifyUser(token);
  if (!decoded) return res.status(401).send("Invalid token");

  db.query(
    "DELETE FROM urls WHERE id = ? AND user_id = ?",
    [id, decoded.id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("DB Error");
      }

      if (result.affectedRows === 0) {
        return res.send("Not allowed or not found");
      }

      res.send("Deleted successfully ✅");
    }
  );
});



// ✅ 4. TOGGLE FAVORITE
router.get("/favorite", (req, res) => {
  const { token, id } = req.query;

  if (!token || !id) return res.status(400).send("Missing data");

  const decoded = verifyUser(token);
  if (!decoded) return res.status(401).send("Invalid token");

  db.query(
    "UPDATE urls SET is_favorite = NOT is_favorite WHERE id = ? AND user_id = ?",
    [id, decoded.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("DB Error");
      }

      res.send("Updated favorite ⭐");
    }
  );
});



// ✅ 5. REDIRECT (ALWAYS LAST)
router.get("/:code", (req, res) => {
  const code = req.params.code;

  db.query(
    "SELECT * FROM urls WHERE short_code = ?",
    [code],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error");
      }

      if (results.length === 0) {
        return res.status(404).send("URL not found");
      }

      // ✅ increment clicks
      db.query(
        "UPDATE urls SET clicks = clicks + 1 WHERE id = ?",
        [results[0].id]
      );

      res.redirect(results[0].long_url);
    }
  );
});

module.exports = router;