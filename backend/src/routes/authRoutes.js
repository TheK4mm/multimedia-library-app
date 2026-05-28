const express = require("express");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/authMiddleware");
const { registerSchema, loginSchema } = require("../validators/authSchemas");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", validate({ body: registerSchema }), authController.register);
router.post("/login",    validate({ body: loginSchema    }), authController.login);
router.get("/me",        requireAuth,                       authController.me);

module.exports = router;
