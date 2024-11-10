// auth.middleware.js
const jwt = require("jsonwebtoken");
const authUser = (req, res, next) => {
  const token = req.cookies.token;
  // Check if token exists
  if (!token) {
    // return res.status(401).json({ message: "Token is required" });
    res.redirect("/login");
  }
  // // Remove "Bearer " prefix if present
  // token = token.replace("Bearer ", "");

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authUser;
