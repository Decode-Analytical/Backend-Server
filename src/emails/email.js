const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SENDGRID_KEY,
    },
  });

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<b>Hey there! </b><br> Development 😉`,
  };

  transporter.sendMail(mailOptions, function (error, success) {
    if (error) logger.error(error);
    logger.info("Email sent: " + success.response);
  });
};

module.exports = sendEmail;
