const asyncHandler = require("../utils/asyncHandler");
const genreService = require("../services/genreService");

exports.list = asyncHandler(async (req, res) => {
  const genres = await genreService.list(req.query.mediaType);
  res.json({ success: true, genres });
});
