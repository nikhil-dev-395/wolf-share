const router = require("express").Router();

router.use((req, res) => {
  return res.status(404).render("404/not-found", {
    title: "404 - Page Not Found",
  });
});

module.exports = { pageNotfoundRouter: router };
