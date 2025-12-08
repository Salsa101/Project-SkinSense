require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const path = require("path");
const fs = require("fs");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Path logo
const logoPath = path.join(__dirname, "../Utils/Logo.png");
const logoData = fs.readFileSync(logoPath).toString("base64");

// Fungsi kirim email generik
async function sendEmail(to, subject, html, attachments = []) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    html,
    attachments,
  };

  try {
    await sgMail.send(msg);
    console.log("Email berhasil dikirim ke", to);
  } catch (err) {
    console.error("Gagal mengirim email:", err);
  }
}

// Fungsi kirim welcome email
async function sendWelcomeEmail(user) {
  const subject = "Welcome to SkinSense!";

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 20px; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
        <img src="cid:app-logo" alt="SkinSense Logo" style="width: 100%; height: auto; margin-bottom: 20px;" />
        <h2 style="color: #395284; margin-bottom: 10px;">Hi ${user.username}, selamat datang! 🎉</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
          Terima kasih sudah bergabung di SkinSense. Sekarang Anda bisa mulai eksplorasi produk yang cocok untuk kulit Anda
          dan memanfaatkan fitur-fitur kami untuk merawat kulit Anda.
        </p>
        <p style="color: #888; font-size: 12px; margin-top: 30px;">— SkinSense Team</p>
      </div>
    </div>
  `;

  const attachments = [
    {
      content: logoData,
      filename: "logo.png",
      type: "image/png",
      disposition: "inline",
      content_id: "app-logo",
    },
  ];

  // Kirim email async tanpa block response register
  sendEmail(user.email, subject, html, attachments);
}

module.exports = { sendEmail, sendWelcomeEmail };
