const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const genreController = require("../controllers/genreController");

const router = express.Router();
router.get("/", requireAuth, genreController.list);

module.exports = router;
