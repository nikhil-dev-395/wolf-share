/* src/controllers/file.controllers.js  */

const File = require("../models/files.models");

const deleteFile = async (req, res) => {
  const { uuid } = req.body;
  try {
    const deleteOneFile = await File.deleteOne({ uuid });
    if (deleteOneFile.deletedCount === 1) {
      console.log("File deleted successfully");
      return res
        .status(200)
        .json({ success: true, message: "File deleted successfully" });
    } else {
      console.log("No file found with the specified UUID");
      return res.status(404).json({
        success: false,
        message: "No file found with the specified UUID",
      });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    /*return something valid in ejs */
    res.status(500).json({ message: "Error deleting file" });
  }
};

const updateFile = async (req, res) => {
  const { uuid } = req.body;
  const updates = req.body;
  try {
    const updateOneFile = await File.findOneAndUpdate({ uuid }, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure model validators are applied
    });

    if (!updateOneFile) {
      return res.status(404).json({ message: "File not found" });
    }
    if (updateOneFile) {
      console.log("file updated successfully");
    }
    /*return something valid in ejs */
     res.status(200).json({
       success: true,
       message: "File updated successfully",
       updateOneFile,
     });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the file",
    });
  }
};

module.exports = { deleteFile, updateFile };
