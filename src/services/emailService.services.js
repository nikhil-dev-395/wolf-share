const nodemailer = require("nodemailer");

const sendMail = async ({ from, to, subject, text, html }) => {
  //   let transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     secure: false,
  //     auth: {
  //       user: process.env.MAIL_USER,
  //       pass: process.env.MAIL_PASS,
  //     },
  //   });
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    pool: true, // Use pooled connections
    maxConnections: 5, // Limit the number of concurrent connections
    timeout: 5000, // Set a timeout for the connection
  });

  let info = await transporter.sendMail({
    from: `wolf share <${from}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};

module.exports = sendMail;
