const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getAllLaporan,
  getMyLaporan,
  getLaporanById,
  createLaporan,
  updateStatusLaporan,
  deleteLaporan,
  updateTindakLanjut,
} = require("../controllers/laporanController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/",  getAllLaporan);
router.get("/my", authMiddleware, getMyLaporan);
router.get("/:id", authMiddleware, getLaporanById);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createLaporan
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  updateStatusLaporan
);

router.put(
  "/:id/tindak-lanjut",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("proof_image"),
  updateTindakLanjut
);

router.delete(
  "/:id",
  authMiddleware,
  deleteLaporan
);

module.exports = router;