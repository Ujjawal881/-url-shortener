const mysql = require("mysql2");

let db;

if (process.env.DATABASE_URL) {
  // ✅ PRODUCTION (Render + Railway)
  db = mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // ✅ LOCAL DEVELOPMENT
  db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ujjawal@881", // your local MySQL password
    database: "url_shortener",
  });
}

db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

module.exports = db;