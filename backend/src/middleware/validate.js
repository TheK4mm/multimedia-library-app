// Validates req.body / req.query / req.params against Zod schemas
// and assigns the parsed (typed, defaulted) result back onto the request.
module.exports = (schemas) => (req, _res, next) => {
  try {
    if (schemas.body)   req.body   = schemas.body.parse(req.body);
    if (schemas.query)  req.query  = schemas.query.parse(req.query);
    if (schemas.params) req.params = schemas.params.parse(req.params);
    next();
  } catch (err) {
    next(err);
  }
};
