const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single("profile_photo"), updateProfile);

module.exports = router;