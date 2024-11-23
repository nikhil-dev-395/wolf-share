/* src/controllers/auth.controllers.js */

const User = require("../models/user.models.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* login controller */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("auth/login", {
        title: "Login",
        error: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET
    );
    /* uncomment when you need for testing */
    // console.log(token);

    res.cookie("token", token, {
      httpOnly: false,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: true,
      SameSite: "Strict",
    });
    res.redirect("/");
  } catch (error) {
    console.log("err at login user", error.message);
    res.render("auth/login", {
      title: "Login",
      error: "An unexpected error occurred. Please try again.",
    });
  }
};

// register controller
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.render("auth/register", {
        title: "register",
        error: "User already exists. Please try logging in.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET
    );

    /* uncomment `token` log when you need for testing */
    // console.log("token", token);
    // res.status(201).json({ message: "user created successfully", token });
    res.cookie("token", token, {
      httpOnly: false,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: true,
      SameSite: "Strict",
    });
    res.redirect("/");
  } catch (error) {
    console.log("err at register user", error.message);
    res.render("auth/register", {
      title: "register",
      error: "An error occurred during registration. Please try again.",
    });
  }
};

module.exports = { login, register };
