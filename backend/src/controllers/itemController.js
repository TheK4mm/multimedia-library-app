const asyncHandler = require("../utils/asyncHandler");
const itemService = require("../services/itemService");

exports.list = asyncHandler(async (req, res) => {
  const data = await itemService.list(req.user.id, req.query);
  res.json({ success: true, ...data });
});

exports.getOne = asyncHandler(async (req, res) => {
  const item = await itemService.get(req.user.id, req.params.id);
  res.json({ success: true, item });
});

exports.create = asyncHandler(async (req, res) => {
  const item = await itemService.create(req.user.id, req.body);
  res.status(201).json({ success: true, item });
});

exports.update = asyncHandler(async (req, res) => {
  const item = await itemService.update(req.user.id, req.params.id, req.body);
  res.json({ success: true, item });
});

exports.remove = asyncHandler(async (req, res) => {
  await itemService.remove(req.user.id, req.params.id);
  res.json({ success: true, message: "Item eliminado." });
});

exports.stats = asyncHandler(async (req, res) => {
  const stats = await itemService.stats(req.user.id);
  res.json({ success: true, stats });
});
