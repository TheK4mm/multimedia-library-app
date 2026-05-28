// Wraps an async route handler so thrown errors flow into Express's
// error pipeline instead of becoming unhandled promise rejections.
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
