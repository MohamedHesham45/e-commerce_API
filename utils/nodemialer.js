const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "amrkataria1234@gmail.com",
    pass: "adsd oclm pegi jpld",
  },
});

module.exports = transporter;
