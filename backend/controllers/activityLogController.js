const db = require("../config/db");

exports.getActivityLogs = (req, res) => {
  const query = `
    SELECT 
      activity_logs.*,
      users.name AS user_name,
      users.role AS user_role,
      laporan.title AS laporan_title
    FROM activity_logs
    LEFT JOIN users ON activity_logs.user_id = users.id
    LEFT JOIN laporan ON activity_logs.laporan_id = laporan.id
    ORDER BY activity_logs.created_at DESC
    LIMIT 30
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil activity lzg",
      });
    }

    res.json(result);
  });
};