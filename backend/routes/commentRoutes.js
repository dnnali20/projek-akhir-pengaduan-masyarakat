const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getCommentsByLaporan,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router.get("/laporan/:laporan_id", authMiddleware, getCommentsByLaporan);

router.post("/laporan/:laporan_id", authMiddleware, createComment);

router.put("/:id", authMiddleware, updateComment);

router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;