/*src/routes/web.routes.js*/

const router = require("express").Router();
const {
  github_profile_url,
  linkedIn_profile_url,
  twitter_profile_url,
} = require("../constants/constants.js");

// with this middleware we can send github & linedin links ffff
router.use((req, res, next) => {
  res.locals.github_profile_url = github_profile_url;
  res.locals.linkedIn_profile_url = linkedIn_profile_url;
  res.locals.twitter_profile_url = twitter_profile_url;
  next();
});

router.get("/", (req, res) => {
  /* add here token for displaying the logout btn */

  return res.render("index", {
    title: "wolf share",
  });
});

router.get("/send", (req, res) => {
  return res.render("helpers/send", {
    title: "send file",
  });
});

router.get("/login", (req, res) => {
  return res.render("auth/login", {
    title: "login",
  });
});

router.get("/register", (req, res) => {
  return res.render("auth/register", {
    title: "register",
  });
});

router.get("/account", (req, res) => {
  /*
  here i only add this values manually to show some data in ejs but add here mongodb db connection quickly to directly fetch the data form db
  */
  return res.render("account", {
    title: "account",
    fileName: "hero",
    fileSize: 200,
    fileDownloadUrl: "https://code.visualstudio.com/docs/editor/editingevolved",
  });
});

/* add here proper details of files , which can help us to download it */
router.get("/download", (req, res) => {
  return res.render("helpers/download", {
    title: "download",
    filename: "let assume this is nikhil.jpg",
    fileSize: 200,
    downloadLink: "",
  });
});

/*from here is pricing ->  remember this following code is for testing purpose*/

const free = {
  planType: "free",
  price: "0",
  paymentCurrency: "dollar",
  whatsIncluded: [
    "Account dashboard support ",
    "You can share files up to 1GB",
    "You can share files via email",
  ],
};

const premium = {
  planType: "premium",
  price: "3",
  paymentCurrency: "dollar",
  whatsIncluded: [
    "Priority account support",
    "Share files up to 10GB",
    "Additional sharing options with tracking",
  ],
};

router.get("/pricing", (req, res) => {
  return res.render("helpers/pricing", {
    title: "pricing",
    free,
    premium,
  });
});

module.exports = { webRouter: router };
