module.exports = (roles) => async (req, res, next) => {
  if (roles.includes(req.user.role)) return next();
  res.status(403).send({ message: "Not authorized" });
};