const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getAllUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC",
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal mengambil data user" });
      }

      res.json(result);
    }
  );
};

exports.getUserById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal mengambil detail user" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.json(result[0]);
    }
  );
};

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "Nama, email, password, dan role wajib diisi",
    });
  }

  const allowedRole = ["user", "admin", "super_admin"];

  if (!allowedRole.includes(role)) {
    return res.status(400).json({ message: "Role tidak valid" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal menambah user, kemungkinan email sudah digunakan",
        });
      }

      res.status(201).json({ message: "User berhasil ditambahkan" });
    }
  );
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      message: "Nama, email, dan role wajib diisi",
    });
  }

  const allowedRole = ["user", "admin", "super_admin"];

  if (!allowedRole.includes(role)) {
    return res.status(400).json({ message: "Role tidak valid" });
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?",
      [name, email, hashedPassword, role, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Gagal update user" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User tidak ditemukan" });
        }

        res.json({ message: "User berhasil diupdate" });
      }
    );
  } else {
    db.query(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Gagal update user" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User tidak ditemukan" });
        }

        res.json({ message: "User berhasil diupdate" });
      }
    );
  }
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  if (Number(id) === req.user.id) {
    return res.status(400).json({
      message: "Tidak bisa menghapus akun sendiri",
    });
  }

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal menghapus user, kemungkinan user masih memiliki laporan/komentar",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil dihapus" });
  });
};