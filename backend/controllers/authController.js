const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Nama, email, dan password wajib diisi",
    });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "user"],
      (err) => {
        if (err) return res.status(500).json({ message: "Gagal register" });

        res.status(201).json({
          message: "Register berhasil",
        });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body || {};


  if (!email || !password) {
    return res.status(400).json({
      message: "Email dan password wajib diisi",
    });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({
        message: "Server error: JWT_SECRET tidak diset",
      });
    }



    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};


exports.getProfile = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT id, name, email, role, profile_photo, birth_date, gender, phone, address, bio, created_at FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal mengambil profil" });

      if (result.length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.json(result[0]);
    }
  );
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { name, birth_date, gender, phone, address, bio } = req.body;
  const profile_photo = req.file ? req.file.filename : null;

  let query = `
    UPDATE users 
    SET name = ?, birth_date = ?, gender = ?, phone = ?, address = ?, bio = ?
  `;

  let values = [name, birth_date, gender, phone, address, bio];

  if (profile_photo) {
    query += `, profile_photo = ?`;
    values.push(profile_photo);
  }

  query += ` WHERE id = ?`;
  values.push(userId);

  db.query(query, values, (err) => {
    if (err) {
      return res.status(500).json({ message: "Gagal update profile" });
    }

    db.query(
      "SELECT id, name, email, role, profile_photo, birth_date, gender, phone, address, bio, created_at FROM users WHERE id = ?",
      [userId],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal mengambil profile" });

        res.json({
          message: "Profile berhasil diupdate",
          user: result[0],
        });
      }
    );
  });
};