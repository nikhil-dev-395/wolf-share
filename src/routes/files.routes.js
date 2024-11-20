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
const { sendFileByEmail } = require("../controllers/sendFile.controllers.js");

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

      // Generate a temporaryLink for the download file
      const temporaryLink = await dropbox.filesGetTemporaryLink({
        path: response.result.path_display,
      });
      console.log("Temporary Link:", temporaryLink.result.link);

      // Cleanup and respond
      const file = new File({
        userId: req.user.userId,
        originalFileName: req.file.originalname,
        filename: req.file.filename,
        uuid: uuid4(),
        path: req.file.path,
        size: req.file.size,
        download_url: temporaryLink.result.link,
        expireAt: Date.now() + 24 * 60 * 60 * 1000,
      });

      await file.save();
      /* we are now updating the allFileLinks in user model */
      const User = require("../models/user.models.js");

      await User.findByIdAndUpdate(
        req.user.userId,
        {
          $push: { allFileLinks: file._id },
        },
        { new: true }
      );

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

router.post("/send/:uuid", authUser, sendFileByEmail);

router.delete("/deleteFile", authUser, deleteFile);
router.put("/updateFile", authUser, updateFile);

module.exports = { fileRouter: router };
