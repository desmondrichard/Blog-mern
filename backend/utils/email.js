const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// for now not for real project:
transporter
  .verify()
  .then(() => {
    console.log("Email server is ready");
  })
  .catch((error) => {
    console.log("Email server error:", error);
  });
module.exports = transporter;
