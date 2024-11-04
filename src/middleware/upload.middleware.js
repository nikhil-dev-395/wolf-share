/* src/middleware/upload.middleware.js */


const multer = require("multer");
const path = require("path");
// const fetch = require("isomorphic-fetch");
const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");
// configuring the dropbox for uploading file from local
const dropbox = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN, // Ensure this environment variable is set
  fetch: fetch,
});

// storage - a place where our file going to store
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 100000 * 100 } }).single(
  "file"
);

module.exports = { upload, dropbox };
