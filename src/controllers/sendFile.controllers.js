// account.controllers.js
// files
const File = require("../models/files.models.js");
/* Assuming this is the email sending service */
const sendEmail = require("../services/emailService.services.js");

const sendFileByEmail = async (req, res) => {
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

      console.log("Email successfully sent:", emailInfo);
      // Log success response

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
};
module.exports = { sendFileByEmail };
