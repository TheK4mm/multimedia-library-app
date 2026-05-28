const genreRepository = require("../repositories/genreRepository");

const list = (mediaType) => genreRepository.list(mediaType);

module.exports = { list };
