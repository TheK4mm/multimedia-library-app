const Item = require("../models/itemModel");

exports.getItems = async (req, res) => {
  const items = await Item.getAllItems();
  res.json(items);
};

exports.createItem = async (req, res) => {
  const newItem = await Item.createItem(req.body);
  res.json(newItem);
};

exports.updateItem = async (req, res) => {
  const updated = await Item.updateItem(req.params.id, req.body);
  res.json(updated);
};

exports.deleteItem = async (req, res) => {
  await Item.deleteItem(req.params.id);
  res.json({ message: "Item eliminado" });
};