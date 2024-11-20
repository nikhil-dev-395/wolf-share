const File = require("../models/files.models.js");
const sendEmail = require("../services/emailService.services.js");

const sendFileByEmail = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const { emailTo, emailFrom, FileTitle, FileMessage } = req.body;

    // Check for required fields
    if (!uuid || !emailTo || !emailFrom) {
      return res.render("helpers/send", {
        title: "send",
        error: "Fields are missing.",
        uuid,
        email: emailFrom || "",
      });
    }

    // Get file from the database
    let file;
    try {
      file = await File.findOne({ uuid });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).send("Database error occurred.");
    }

    if (!file) {
      return res.render("helpers/send", {
        title: "send",
        error: "The requested file does not exist.",
        uuid,
        email: emailFrom || "",
      });
    }

    // Check if email is already sent
    if (file.sender) {
      return res.render("helpers/success", {
        title: "error ",
        receiver: file.receiver,
        filename: file.filename,
        fileSize: file.size,
        download_url: file.download_url,
        uuid: file.uuid,
        error:
          "email already sent to `" +
          file.receiver +
          "` ,  if you want to sent this to another then click back to home button",
      });
    }

    // Update file information
    file.sender = emailFrom;
    file.receiver = emailTo;
    file.FileTitle = FileTitle;
    file.FileMessage = FileMessage;
    await file.save();

    // Send email
    try {
      const emailInfo = await sendEmail({
        from: emailFrom,
        to: emailTo,
        subject: FileTitle,
        text: `${emailFrom} shared a file with you...`,
        html: require("../services/emailTemplate.services.js")({
          emailFrom,
          downloadLink: file.download_url,
          size: parseInt(file.size / 1000) + "kb",
          expires: "24 hrs",
          FileMessage,
        }),
      });

      console.log("Email successfully sent:", emailInfo);

      // Render success page
      res.render("helpers/success", {
        title: "Success",
        emailInfo,
        receiver: file.receiver,
        filename: file.filename,
        fileSize: file.size,
        download_url: file.download_url,
        uuid: file.uuid,
        error: null,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
      return res.render("helpers/send", {
        title: "send",
        error: "Failed to send email. Please try again later.",
        uuid,
      });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).send("Internal Server Error.");
  }
};

module.exports = { sendFileByEmail };
