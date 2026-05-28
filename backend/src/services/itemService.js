const AppError = require("../utils/AppError");
const itemRepository = require("../repositories/itemRepository");

const list = (userId, filters) => itemRepository.list(userId, filters);

const get = async (userId, id) => {
  const item = await itemRepository.findById(userId, id);
  if (!item) throw AppError.notFound("Item no encontrado.");
  return item;
};

const create = async (userId, data) => {
  const created = await itemRepository.create(userId, data);
  if (data.genreIds?.length) {
    await itemRepository.replaceGenres(created.id, data.genreIds);
  }
  return itemRepository.findById(userId, created.id);
};

const update = async (userId, id, data) => {
  const updated = await itemRepository.update(userId, id, data);
  if (!updated) throw AppError.notFound("Item no encontrado.");
  if (Array.isArray(data.genreIds)) {
    await itemRepository.replaceGenres(updated.id, data.genreIds);
  }
  return itemRepository.findById(userId, updated.id);
};

const remove = async (userId, id) => {
  const ok = await itemRepository.remove(userId, id);
  if (!ok) throw AppError.notFound("Item no encontrado.");
};

const stats = (userId) => itemRepository.stats(userId);

module.exports = { list, get, create, update, remove, stats };
