const express = require("express");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  createItemSchema,
  updateItemSchema,
  listItemsQuerySchema,
  idParamSchema,
} = require("../validators/itemSchemas");
const itemController = require("../controllers/itemController");

const router = express.Router();

router.use(requireAuth);

router.get   ("/stats",           itemController.stats);
router.get   ("/",   validate({ query:  listItemsQuerySchema }), itemController.list);
router.post  ("/",   validate({ body:   createItemSchema    }), itemController.create);
router.get   ("/:id", validate({ params: idParamSchema }),       itemController.getOne);
router.put   ("/:id", validate({ params: idParamSchema, body: updateItemSchema }), itemController.update);
router.delete("/:id", validate({ params: idParamSchema }),       itemController.remove);

module.exports = router;
