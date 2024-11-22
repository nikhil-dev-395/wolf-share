/* src/middleware/roles.middleware.js */
const authRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "access denied" });
    }
    next();
  };
};

module.exports = authRoles;