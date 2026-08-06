const mysql = require("mysql2");
require("dotenv").config();

console.log("HOST :", process.env.DB_HOST);
console.log("USER :", process.env.DB_USER);
console.log("PORT :", process.env.DB_PORT);
console.log("DB   :", process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("Database gagal terkoneksi:", err);
  } else {
    console.log("Database berhasil terkoneksi");
  }
});

module.exports = db;