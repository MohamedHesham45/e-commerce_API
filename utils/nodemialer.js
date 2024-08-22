const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMIALER_EMAIL,
    pass: process.env.NODEMIALER_PASS,
  },
});

module.exports = transporter;
