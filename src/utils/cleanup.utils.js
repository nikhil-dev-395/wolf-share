const schedule = require("node-schedule");
const File = require("../models/files.models.js");
const { dropbox } = require("../middleware/upload.middleware.js");

// Schedule job to run every hour
schedule.scheduleJob("0 * * * *", async () => {
  try {
    const expiredFiles = await File.find({
      expireAt: { $lte: new Date() }, // Find files past their expiration time
    });

    for (const file of expiredFiles) {
      try {
        // Delete file from Dropbox
        await dropbox.filesDeleteV2({ path: `/${file.filename}` });

        // Delete file from the database
        await file.deleteOne();
        console.log(`Deleted file ${file.filename} successfully`);
      } catch (err) {
        console.error(`Failed to delete file ${file.filename}:`, err);
      }
    }
  } catch (err) {
    console.error("Error during cleanup job:", err);
  }
});
