const File = require("../models/files.models");
const path = require("path");
const router = require("express").Router();

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", {
        error: " link has been expired",
        title: "download",
      });
    }

    const filePath = `${__dirname}/../../${file.path}`;
    // increment the download count
    file.downloadCount = (file.downloadCount || 0) + 1;
    await file.save();
    res.download(filePath);
  } catch (error) {
    console.log(error);
    res.render("helpers/download", {
      title: "Download",
      error:
        "An error occurred while trying to download the file. Please try again.",
    });
  }
});

module.exports = { downloadRouter: router };
