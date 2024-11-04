const File = require("../models/files.models.js");
// which font we are using now
const router = require("express").Router();

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("helpers/download", {
        error: "link has been expired",
        title: "download",
      });
    }

    res.render("helpers/download", {
      uuid: file.uuid,
      filename: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      title: "download",
    });
  } catch (error) {
    res.render("helpers/download", { error: "something went wrong...", title :"download" });
  }
});

module.exports = { showRouter: router };
