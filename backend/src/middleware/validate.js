// Validates req.body / req.query / req.params against Zod schemas
// and assigns the parsed (typed, defaulted) result back onto the request.
module.exports = (schemas) => (req, _res, next) => {
  try {
    if (schemas.body)   req.body   = schemas.body.parse(req.body);
    if (schemas.query) {
      // In Express 5 `req.query` is a read-only getter, so a plain
      // assignment is silently ignored and downstream code would keep
      // seeing the raw (string) query values instead of the coerced ones
      // (e.g. `favorite` would stay "true" instead of boolean true,
      // breaking the favorite filter). Redefine it as an own data
      // property so the parsed result actually takes effect.
      const parsedQuery = schemas.query.parse(req.query);
      Object.defineProperty(req, "query", {
        value: parsedQuery,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
    if (schemas.params) req.params = schemas.params.parse(req.params);
    next();
  } catch (err) {
    next(err);
  }
};
