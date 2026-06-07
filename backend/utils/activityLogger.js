const db = require("../config/db");

const createActivityLog = ({ user_id, laporan_id, action, description }) => {
  // Jangan pernah mengganggu proses utama (mis. insert laporan)
  try {
    const query = `
      INSERT INTO activity_logs 
      (user_id, laporan_id, action, description)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      query,
      [user_id || null, laporan_id || null, action, description],
      (err) => {
        if (err) {
          console.log("Gagal membuat activity log:", err.message);
        }
      }
    );
  } catch (e) {
    console.log("Error createActivityLog:", e?.message || e);
  }
};

module.exports = createActivityLog;

