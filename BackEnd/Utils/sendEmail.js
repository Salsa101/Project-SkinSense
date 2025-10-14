require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to, subject, html, attachments = []) {
  const mailOptions = {
    from: `"SkinSense Support" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email berhasil dikirim ke", to);
  } catch (err) {
    console.error("Gagal mengirim email:", err.response || err);
  }
}

module.exports = sendEmail;
