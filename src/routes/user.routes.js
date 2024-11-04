const { login, register } = require("../controllers/auth.controllers.js");
const authUser = require("../middleware/auth.middleware.js");

const router = require("express").Router();
router.post("/login", login);
router.post("/register", register);
router.post("/test", authUser, (req, res) => {
  const userId = req.user.userId;
  res.send(userId)
});

module.exports = { userRouter: router };
