const db = require("../config/db");

exports.getCommentsByLaporan = (req, res) => {
  const { laporan_id } = req.params;

  const query = `
    SELECT 
      comments.*,
      users.name AS user_name,
      users.role AS user_role
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.laporan_id = ?
    ORDER BY comments.created_at ASC
  `;

  db.query(query, [laporan_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mengambil komentar" });
    }

    res.json(result);
  });
};

exports.createComment = (req, res) => {
  req.app.get("io").emit("commentsUpdated");
  const { laporan_id } = req.params;
  const { comment } = req.body;
  const user_id = req.user.id;

  if (!comment) {
    return res.status(400).json({ message: "Komentar wajib diisi" });
  }

  const query = `
    INSERT INTO comments (laporan_id, user_id, comment)
    VALUES (?, ?, ?)
  `;

  db.query(query, [laporan_id, user_id, comment], (err) => {
    if (err) {
      return res.status(500).json({ message: "Gagal menambah komentar" });
    }

    res.status(201).json({ message: "Komentar berhasil ditambahkan" });
  });
};

exports.updateComment = (req, res) => {
  req.app.get("io").emit("commentsUpdated");
  const { id } = req.params;
  const { comment } = req.body;
  const user_id = req.user.id;
  const role = req.user.role;

  if (!comment) {
    return res.status(400).json({ message: "Komentar wajib diisi" });
  }

  let query = "UPDATE comments SET comment = ? WHERE id = ?";
  let values = [comment, id];

  if (role === "user") {
    query += " AND user_id = ?";
    values.push(user_id);
  }

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal update komentar" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Komentar tidak ditemukan atau bukan milik kamu",
      });
    }

    res.json({ message: "Komentar berhasil diupdate" });
  });
};

exports.deleteComment = (req, res) => {
  req.app.get("io").emit("commentsUpdated");
  const { id } = req.params;
  const user_id = req.user.id;
  const role = req.user.role;

  let query = "DELETE FROM comments WHERE id = ?";
  let values = [id];

  if (role === "user") {
    query += " AND user_id = ?";
    values.push(user_id);
  }

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal menghapus komentar" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Komentar tidak ditemukan atau bukan milik kamu",
      });
    }

    res.json({ message: "Komentar berhasil dihapus" });
  });
};