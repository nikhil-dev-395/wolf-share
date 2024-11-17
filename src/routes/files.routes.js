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
const authUser = require("../middleware/auth.middleware.js");
const {
  deleteFile,
  updateFile,
} = require("../controllers/files.controllers.js");

// router.post("/upload",authUser, (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       console.error("Multer error:", err);
//       return res.status(500).json({ success: false, err });
//     }

//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, error: "All fields are required" });
//     }

//     console.log("Received file:", req.file);

//     try {
//       const fileContent = fs.readFileSync(req.file.path);

//       // Upload file to Dropbox
//       const dropbox_response = await dropbox.filesUpload({
//         path: "/" + req.file.filename,
//         contents: fileContent,
//       });

//       // Get a temporary download link for the uploaded file
//       const downloadLinkResponse = await dropbox.filesGetTemporaryLink({
//         path: dropbox_response.result.path_display,
//       });

//       // Save file metadata to the database, including the download link
//       const file = new File({
//         /*add userId for checking user is authorized or not  , expireAt, mimetype, userId, sender ,  receiver ? receiver : none */
//         userId: req.user.userId,
//         originalFileName: req.file.originalname,
//         filename: req.file.filename,
//         uuid: uuid4(), // Generate UUID for the file
//         path: req.file.path,
//         size: req.file.size,
//         download_url: downloadLinkResponse.result.link, // Store the download link
//       });

//       await file.save();
//       console.log({
//         success: true,
//         file: `${process.env.APP_BASE_URL}/files/${file.uuid}`, // Use the saved file's UUID here
//         message: "File uploaded successfully",
//         download_url: downloadLinkResponse.result.link,
//       });

//       let uuid = file.uuid;
//       res.redirect(`/send/${uuid}`);
//     } catch (uploadError) {
//       console.error("Dropbox upload error:", uploadError);
//       res.status(500).json({ success: false, error: "Dropbox upload failed" });
//     }
//   });
// });

let isPaused = false; // Flag to manage pause and resume

// Route to upload a file in chunks
router.post("/upload", authUser, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "Upload failed", err });

    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const filePath = req.file.path;
    const fileSize = fs.statSync(filePath).size;
    const chunkSize = 2 * 1024 * 1024; // 2 MB chunk size
    const fileStream = fs.createReadStream(filePath, {
      highWaterMark: chunkSize,
    });

    try {
      let sessionId = null;
      let offset = 0;

      for await (const chunk of fileStream) {
        if (isPaused) {
          console.log("Upload paused...");
          await new Promise((resolve) => {
            const interval = setInterval(() => {
              if (!isPaused) {
                clearInterval(interval);
                resolve();
              }
            }, 100); // Check every 100 ms if resumed
          });
          console.log("Resuming upload...");
        }

        if (!sessionId) {
          // Start the upload session
          const response = await dropbox.filesUploadSessionStart({
            contents: chunk,
          });
          sessionId = response.result.session_id;
        } else {
          // Append to the session
          await dropbox.filesUploadSessionAppendV2({
            cursor: { session_id: sessionId, offset: offset },
            contents: chunk,
          });
        }

        offset += chunk.length;
        console.log(`Uploaded ${offset} of ${fileSize} bytes`);
      }

      // Complete the upload session
      const response = await dropbox.filesUploadSessionFinish({
        cursor: { session_id: sessionId, offset: offset },
        commit: {
          path: `/${req.file.filename}`,
          mode: "add",
          autorename: true,
        },
      });

      // Cleanup and respond
      const file = new File({
        userId: req.user.userId,
        originalFileName: req.file.originalname,
        filename: req.file.filename,
        uuid: uuid4(),
        path: req.file.path,
        size: req.file.size,
        download_url: response.result.path_display,
        expireAt: Date.now() + 24 * 60 * 60 * 1000,
      });

      await file.save();
      const uuid = file.uuid;
      res.redirect(`/send/${uuid}`);
    } catch (uploadError) {
      console.error("Dropbox upload error:", uploadError);
      res.status(500).json({ error: "Upload failed" });
    } finally {
      fs.unlinkSync(filePath); // Delete the local file
    }
  });
});

// Endpoint to pause the upload
router.post("/pause-upload", (req, res) => {
  isPaused = true;
  res.status(200).json({ message: "Upload paused" });
});

// Endpoint to resume the upload
router.post("/resume-upload", (req, res) => {
  isPaused = false;
  res.status(200).json({ message: "Upload resumed" });
});

const sendEmail = require("../services/emailService.services.js"); // Assuming this is the email sending service
// const authUser = require("../middleware/auth.middleware.js");

router.post("/send/:uuid", authUser, async (req, res) => {
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
    // console.log("Preparing to send email with the following details:");
    // console.log("From:", emailFrom);
    // console.log("To:", emailTo);
    // console.log("Subject:", FileTitle);
    // console.log("File Link:", file.download_url);
    // console.log("File Size:", parseInt(file.size / 1000) + "kb");

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

router.delete("/deleteFile",authUser, deleteFile);
router.put("/updateFile",authUser, updateFile);

module.exports = { fileRouter: router };
