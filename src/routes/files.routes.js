/*   src/routes/file.routes.js*/

const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");
const { v4: uuid4 } = require("uuid");
const fs = require("fs");

// files
const File = require("../models/files.models.js");
const { upload, dropbox } = require("../middleware/upload.middleware.js");

router.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ success: false, err });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    console.log("Received file:", req.file);

    try {
      const fileContent = fs.readFileSync(req.file.path);

      // Upload file to Dropbox
      const dropbox_response = await dropbox.filesUpload({
        path: "/" + req.file.filename,
        contents: fileContent,
      });

      // Get a temporary download link for the uploaded file
      const downloadLinkResponse = await dropbox.filesGetTemporaryLink({
        path: dropbox_response.result.path_display,
      });

      // Save file metadata to the database, including the download link
      const file = new File({
        /*add userId for checking user is authorized or not  , expireAt, mimetype, userId, sender ,  receiver ? receiver : none */
        // userId: req.user.userId,
        originalFileName: req.file.originalname,
        filename: req.file.filename,
        uuid: uuid4(), // Generate UUID for the file
        path: req.file.path,
        size: req.file.size,
        download_url: downloadLinkResponse.result.link, // Store the download link
      });

      await file.save();
      console.log({
        success: true,
        file: `${process.env.APP_BASE_URL}/files/${file.uuid}`, // Use the saved file's UUID here
        message: "File uploaded successfully",
        download_url: downloadLinkResponse.result.link,
      });
      res.render("helpers/success", {
        title: "success",
        filename: req.file.filename,
        fileSize: req.file.size,
        download_url: downloadLinkResponse.result.link,
      });
    } catch (uploadError) {
      console.error("Dropbox upload error:", uploadError);
      res.status(500).json({ success: false, error: "Dropbox upload failed" });
    }
  });
});

router.post("/send", async (req, res) => {
  try {
    const { uuid, emailTo, emailFrom } = req.body;
    if (!uuid || !emailTo || !emailFrom) {
      res.status(422).send("all fields are required!");
    }
    // get file from database

    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      res.status(422).send("email already sent");
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    await file.save();

    // send email

    const sendEmail = require("../services/emailService.services.js");
    sendEmail({
      from: emailFrom,
      to: emailTo,
      subject: "wolf share file sharing",
      text: ` ${emailFrom} shared a file with you...`,
      html: require("../services/emailTemplate.services.js")({
        emailFrom: emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size: parseInt(file.size / 1000) + "kb",
        expires: "24 hrs",
      }),
    });

    return res.status(200).json({
      success: true,
      message: "email was successfully sent",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { fileRouter: router };
