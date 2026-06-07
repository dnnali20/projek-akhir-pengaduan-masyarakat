const db = require("../config/db");

exports.getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories ORDER BY id DESC", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mengambil kategori" });
    }

    res.json(result);
  });
};

exports.createCategory = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nama kategori wajib diisi" });
  }

  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Gagal menambah kategori" });
      }

      res.status(201).json({ message: "Kategori berhasil ditambahkan" });
    }
  );
};

exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nama kategori wajib diisi" });
  }

  db.query(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal update kategori" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }

      res.json({ message: "Kategori berhasil diupdate" });
    }
  );
};

exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM categories WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal menghapus kategori, kemungkinan kategori masih dipakai laporan",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.json({ message: "Kategori berhasil dihapus" });
  });
};