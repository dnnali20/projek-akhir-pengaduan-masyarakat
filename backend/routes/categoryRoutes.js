const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.get("/", authMiddleware, getAllCategories);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "super_admin"),
  deleteCategory
);

module.exports = router;