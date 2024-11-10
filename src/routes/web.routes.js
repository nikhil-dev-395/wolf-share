/*src/routes/web.routes.js*/

const router = require("express").Router();
const {
  github_profile_url,
  linkedIn_profile_url,
  twitter_profile_url,
} = require("../constants/constants.js");
/*model files*/
const File = require("../models/files.models.js");
const User = require("../models/user.models.js");
/*middleware files*/

const authUser = require("../middleware/auth.middleware.js");

// with this middleware we can send github & linkedin links ffff
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

router.get("/send/:uuid", async (req, res) => {
  const uuid = req.params.uuid;

  try {
    // Fetch the file details from the database
    const findFile = await File.findOne(
      { uuid },
      "originalFileName size uuid download_url"
    );

    // Check if the file exists
    if (!findFile) {
      return res.status(404).json({ error: "File not found" });
    }

    // Render the template with the file details
    return res.render("helpers/send", {
      title: "Send File",
      originalFileName: findFile.originalFileName,
      size: findFile.size,
      uuid: findFile.uuid,
      download_url: findFile.download_url,
    });
  } catch (error) {
    console.error("Error fetching file:", error); // Log the entire error object
    return res.status(500).json({
      success: false,
      error: "An error occurred",
      details: error.message,
    });
  }
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

router.get("/account", authUser, async (req, res) => {
  /*
  here i only add this values manually to show some data in ejs but add here mongodb db connection quickly to directly fetch the data form db
  */

  const userId = req.user.userId;
  const findUserInformation = await User.findOne(
    { _id: userId },
    " username email allFileLinks "
  );

  if (!findUserInformation) {
    res.status(400).json({
      success: false,
      message: "user not fount || findUserInformation",
    });
  }

  return res.render("account", {
    username: findUserInformation.username,
    email: findUserInformation.email,
    allFileLinksCount: findUserInformation.allFileLinks?.length || 0,
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
