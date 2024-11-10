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

      //   res.render("helpers/success", {
      //     title: "success",
      //     filename: req.file.filename,
      //     fileSize: req.file.size,
      //     download_url: downloadLinkResponse.result.link,
      //     uuid: file.uuid,
      //   });

      let uuid = file.uuid;
      res.redirect(`/send/${uuid}`);
    } catch (uploadError) {
      console.error("Dropbox upload error:", uploadError);
      res.status(500).json({ success: false, error: "Dropbox upload failed" });
    }
  });
});

// router.post("/send/:uuid", async (req, res) => {
//   try {
//     const uuid = req.params.uuid;
//     const { emailTo, emailFrom, FileTitle, FileMessage } = req.body;

//     // Check for required fields
//     if (!uuid || !emailTo || !emailFrom) {
//       return res.status(422).send("All fields are required!"); // Return here
//     }

//     // Get file from database
//     const file = await File.findOne({ uuid: uuid });

//     if (!file) {
//       return res.status(404).send("File not found"); // Return if file is not found
//     }

//     if (file.sender) {
//       return res.status(422).send("Email already sent"); // Return if email is already sent
//     }

//     // Update file information
//     file.sender = emailFrom;
//     file.receiver = emailTo;
//     file.FileTitle = FileTitle;
//     file.FileMessage = FileMessage;
//     await file.save();

//     // Send email
//     const sendEmail = require("../services/emailService.services.js");
//     const emailInfo = await sendEmail({
//       from: emailFrom,
//       to: emailTo,
//       subject: FileTitle,
//       text: `${emailFrom} shared a file with you...`,
//       html: require("../services/emailTemplate.services.js")({
//         emailFrom: emailFrom,
//         downloadLink: `${file.download_url}`,
//         size: parseInt(file.size / 1000) + "kb",
//         expires: "24 hrs",
//         FileMessage,
//       }),
//     });

//     // return res.status(200).json({
//     //   success: true,
//     //   message: "Email was successfully sent",
//     //   emailInfo, // Optionally return email info for debugging
//     // });

//     res.render("helpers/success", {
//       title: "success",
//       emailInfo,
//       receiver: file.receiver,
//       filename: file.filename,
//       fileSize: file.size,
//       download_url: file.download_url,
//       uuid: file.uuid,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server Error"); // Handle errors properly
//   }
// });

// const express = require("express");
// const router = express.Router();
// const File = require("../models/File"); // Assuming there's a File model
const sendEmail = require("../services/emailService.services.js"); // Assuming this is the email sending service

router.post("/send/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const { emailTo, emailFrom, FileTitle, FileMessage } = req.body;

    // Check for required fields
    if (!uuid || !emailTo || !emailFrom) {
      return res.status(422).send("All fields are required!"); // Return here if any field is missing
    }

    // Get file from the database
    const file = await File.findOne({ uuid: uuid });
    if (!file) {
      return res.status(404).send("File not found"); // Return if file is not found
    }

    if (file.sender) {
      return res.status(422).send("Email already sent"); // Return if email is already sent
    }

    // Update file information
    file.sender = emailFrom;
    file.receiver = emailTo;
    file.FileTitle = FileTitle;
    file.FileMessage = FileMessage;
    await file.save();

    // Debug log to verify data before sending email
    console.log("Preparing to send email with the following details:");
    console.log("From:", emailFrom);
    console.log("To:", emailTo);
    console.log("Subject:", FileTitle);
    console.log("File Link:", file.download_url);
    console.log("File Size:", parseInt(file.size / 1000) + "kb");

    // Send email
    try {
      const emailInfo = await sendEmail({
        from: emailFrom,
        to: emailTo,
        subject: FileTitle,
        text: `${emailFrom} shared a file with you...`,
        html: require("../services/emailTemplate.services.js")({
          emailFrom: emailFrom,
          downloadLink: file.download_url,
          size: parseInt(file.size / 1000) + "kb",
          expires: "24 hrs",
          FileMessage,
        }),
      });

      console.log("Email successfully sent:", emailInfo); // Log success response

      // Render success page
      res.render("helpers/success", {
        title: "Success",
        emailInfo,
        receiver: file.receiver,
        filename: file.filename,
        fileSize: file.size,
        download_url: file.download_url,
        uuid: file.uuid,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError); // Log email error
      return res.status(500).send("Error sending email");
    }
  } catch (error) {
    console.error("Internal Server Error:", error); // Log other errors
    return res.status(500).send("Internal Server Error"); // Handle other errors properly
  }
});

module.exports = { fileRouter: router };
