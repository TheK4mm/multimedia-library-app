module.exports = (req, res, next) => {

  if (!req.headers.authorization) {
    return res.status(403).json({ message: "No autorizado" });
  }

  next();
};