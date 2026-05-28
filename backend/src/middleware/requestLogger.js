const logger = require("../config/logger");

module.exports = (req, _res, next) => {
  const start = Date.now();
  _res.on("finish", () => {
    const ms = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} -> ${_res.statusCode} (${ms}ms)`);
  });
  next();
};
