const express = require("express");
const authRoutes  = require("./authRoutes");
const itemRoutes  = require("./itemRoutes");
const genreRoutes = require("./genreRoutes");

const router = express.Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.use("/auth",   authRoutes);
router.use("/items",  itemRoutes);
router.use("/genres", genreRoutes);

module.exports = router;
