const db = require("../config/db");
const createActivityLog = require("../utils/activityLogger");

exports.getAllLaporan = (req, res) => {
  const role = req.user?.role;

  // Untuk admin/super_admin: tampilkan semua status
  // Untuk user: hanya approved (publik)
  const statusCondition =
    role === "admin" || role === "super_admin"
      ? ""
      : "WHERE laporan.status = 'approved'";

  const query = `
    SELECT
      laporan.*,
      users.name as user_name,
      categories.name as category_name
    FROM laporan
    LEFT JOIN users ON laporan.user_id = users.id
    LEFT JOIN categories ON laporan.category_id = categories.id
    ${statusCondition}
    ORDER BY laporan.created_at DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mengambil data laporan" });
    }

    res.json(result);
  });
};

exports.getLaporanById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      laporan.*,
      users.name AS user_name,
      categories.name AS category_name
    FROM laporan
    LEFT JOIN users ON laporan.user_id = users.id
    LEFT JOIN categories ON laporan.category_id = categories.id
    WHERE laporan.id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mengambil detail laporan" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    res.json(result[0]);
  });
};

exports.getMyLaporan = (req, res) => {
  const user_id = req.user.id;

  const query = `
    SELECT 
      laporan.*,
      users.name AS user_name,
      categories.name AS category_name
    FROM laporan
    LEFT JOIN users ON laporan.user_id = users.id
    LEFT JOIN categories ON laporan.category_id = categories.id
    WHERE laporan.user_id = ?
    ORDER BY laporan.created_at DESC
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mengambil laporan saya" });
    }

    res.json(result);
  });
};

exports.createLaporan = (req, res) => {
  req.app.get("io").emit("laporanUpdated");
  const { category_id, title, description, latitude, longitude, location_address } = req.body;
  const user_id = req.user.id;
  const image = req.file ? req.file.filename : null;

  if (!category_id || !title || !description) {
    return res.status(400).json({
      message: "Kategori, judul, dan deskripsi wajib diisi",
    });
  }

  if (!location_address) {
    return res.status(400).json({
      message: "Alamat lokasi laporan wajib diisi",
    });
  }

  // latitude & longitude bersifat opsional
  const lat = latitude || null;
  const lng = longitude || null;

  const query = `
  INSERT INTO laporan 
  (user_id, category_id, title, description, image, status, latitude, longitude, location_address)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  db.query(
    query,
    [user_id, category_id, title, description, image, "pending", lat, lng, location_address],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal membuat laporan",
        });
      }

      createActivityLog({
        user_id,
        laporan_id: result.insertId,
        action: "CREATE_LAPORAN",
        description: `Membuat laporan baru: ${title}`,
      });

      req.app.get("io")?.emit("activityUpdated");

      res.status(201).json({
        message: "Laporan berhasil dibuat",
      });
    });
};

exports.updateStatusLaporan = (req, res) => {
  req.app.get("io").emit("laporanUpdated");

  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ["pending", "approved", "rejected"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "Status tidak valid",
    });
  }

  db.query(
    "UPDATE laporan SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal update status laporan" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }

      // Activity log admin
      createActivityLog({
        user_id: req.user.id,
        laporan_id: id,
        action:
          status === "approved"
            ? "APPROVE_LAPORAN"
            : status === "rejected"
              ? "REJECT_LAPORAN"
              : "UPDATE_STATUS",
        description:
          status === "approved"
            ? `Menyetujui laporan (id: ${id})`
            : status === "rejected"
              ? `Menolak laporan (id: ${id})`
              : `Update status laporan (id: ${id})`,
      });

      res.json({
        message: "Status laporan berhasil diupdate",
      });
    }
  );
};

exports.updateTindakLanjut = (req, res) => {
  req.app.get("io").emit("laporanUpdated");

  const { id } = req.params;
  const { status, admin_note, process_note } = req.body;

  const proof_image = req.file ? req.file.filename : null;

  const allowedStatus = ["pending", "approved", "rejected"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  let query = `
    UPDATE laporan 
    SET 
      status = ?,
      admin_note = ?,
      process_note = ?,
      process_at = NOW(),
      resolved_at = NOW()
  `;

  let values = [status, admin_note || null, process_note || null];

  if (proof_image) {
    query += `, proof_image = ?`;
    values.push(proof_image);
  }

  query += ` WHERE id = ?`;
  values.push(id);

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal update tindak lanjut" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    // Activity log admin
    createActivityLog({
      user_id: req.user.id,
      laporan_id: id,
      action: "UPDATE_TINDAK_LANJUT",
      description: `Update tindak lanjut laporan (id: ${id})`,
    });

    res.json({ message: "Tindak lanjut berhasil diupdate" });
  });
};

exports.deleteLaporan = (req, res) => {
  req.app.get("io").emit("laporanUpdated");

  const { id } = req.params;
  const user_id = req.user.id;

  const role = req.user.role;

  let query = "DELETE FROM laporan WHERE id = ?";
  let values = [id];

  if (role === "user") {
    query += " AND user_id = ?";
    values.push(user_id);
  }

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal menghapus laporan" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Laporan tidak ditemukan atau bukan milik kamu",
      });
    }

    res.json({
      message: "Laporan berhasil dihapus",
    });
  });
};