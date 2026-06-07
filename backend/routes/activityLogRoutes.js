const express = require("express");
const router = express.Router();

const { getActivityLogs } = require("../controllers/activityLogController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("admin", "super_admin"), getActivityLogs);


module.exports = router;