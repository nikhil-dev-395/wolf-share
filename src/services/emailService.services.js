// const nodemailer = require("nodemailer");

// const sendMail = async ({ from, to, subject, text, html }) => {
//   let transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//     pool: true, // Use pooled connections
//     maxConnections: 5, // Limit the number of concurrent connections
//     timeout: 5000, // Set a timeout for the connection
//   });

//   let info = await transporter.sendMail({
//     from: `wolf share <${from}>`,
//     to,
//     subject,
//     text,
//     html,
//   });

//   return info;
// };

// module.exports = sendMail;

const nodemailer = require("nodemailer");
/* now we are gmail smtp server */
const sendMail = async ({ from, to, subject, text, html }) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT, 
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      pool: true, // Use pooled connections
      maxConnections: 5, // Limit the number of concurrent connections
      timeout: 5000, // Set a timeout for the connection
    });

    let info = await transporter.sendMail({
      from: `Wolf Share <${from}>`, // Custom "from" label
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendMail;
