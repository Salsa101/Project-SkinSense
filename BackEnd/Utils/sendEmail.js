require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");
const logoPath = path.join(__dirname, "../Utils/Logo.png");

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

async function sendWelcomeEmail(user) {
  const subject = "Welcome to SkinSense!";

  const html = `
  <div style="font-family: 'Arial', sans-serif; background-color: #f4f6f8; padding: 40px 20px; text-align: center;">
      <!-- Card container -->
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
          
          <!-- Logo -->
          <img src="cid:app-logo" alt="SkinSense Logo" style="width: 100%; height: auto; margin-bottom: 20px;" />

          <!-- Title -->
          <h2 style="color: #395284; margin-bottom: 10px;">Hi ${user.username}, selamat datang! 🎉</h2>
          
          <!-- Message -->
          <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
              Terima kasih sudah bergabung di SkinSense. Sekarang Anda bisa mulai eksplorasi produk yang cocok untuk kulit Anda
              dan memanfaatkan fitur-fitur kami untuk merawat kulit Anda.
          </p>

           <!-- Footer -->
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
              — SkinSense Team
          </p>
      </div>
  </div>
  `;

  const attachments = [
    {
      filename: "logo.png",
      path: logoPath,
      cid: "app-logo",
    },
  ];

  await sendEmail(user.email, subject, html, attachments);
}

module.exports = { sendEmail, sendWelcomeEmail };
