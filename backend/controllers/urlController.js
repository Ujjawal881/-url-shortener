const db = require("../config/db");
const generateCode = require("../utils/generateCode");

// CREATE SHORT URL
exports.createShortUrl = (req, res) => {
  const { longUrl } = req.body;

  // 🔍 Check if data is coming
  console.log("Received URL:", longUrl);

  if (!longUrl) {
    return res.status(400).json({ message: "URL is required" });
  }

  const shortCode = generateCode();
  console.log("Generated Code:", shortCode);

  db.query(
    "INSERT INTO urls (short_code, long_url) VALUES (?, ?)",
    [shortCode, longUrl],
    (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json(err);
      }

      console.log("Data inserted successfully ✅");

      res.json({
        shortUrl: `http://localhost:5001/${shortCode}`
      });
    }
  );
};

// REDIRECT
exports.redirectUrl = (req, res) => {
  const { code } = req.params;

  db.query(
    "SELECT * FROM urls WHERE short_code = ?",
    [code],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(404).json({ message: "URL not found" });

      const url = results[0];

      // increment clicks
      db.query(
        "UPDATE urls SET clicks = clicks + 1 WHERE id = ?",
        [url.id]
      );

      res.redirect(url.long_url);
    }
  );
};