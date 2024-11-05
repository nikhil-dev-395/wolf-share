// files.models.js

const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalFileName: { type: String, required: false },
    filename: { type: String, required: false },
    path: { type: String, required: false },
    FileMessage: { type: String, required: false }, 
    FileTitle: { type: String, required: false },
    size: { type: Number, required: false },
    uuid: { type: String, required: false },
    /*add expire in 24hrs in mongodb collection and dropbox storage*/
    // expiration: { type: Date, required: false },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
      required: false,
    },
    downloadCount: { type: Number, default: 0, required: false },
    sender: { type: String, required: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    receiver: { type: String, required: false },
    download_url: { type: String, required: false },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
