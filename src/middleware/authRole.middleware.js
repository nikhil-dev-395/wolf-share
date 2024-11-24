const authRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      // Role is not allowed, deny access
      return res.status(403).json({ message: "Access denied" });
    }
    // Role is allowed, proceed
    next();
  };
};

module.exports = authRole;
