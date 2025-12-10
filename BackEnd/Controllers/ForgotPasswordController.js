const { User, PasswordReset } = require("../models");
const { sendEmail } = require("../Utils/sendEmail");
const path = require("path");
const bcrypt = require("bcrypt");
const logoPath = path.join(__dirname, "../Utils/Logo.png");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await PasswordReset.destroy({ where: { userId: user.id, used: false } });

    try {
      await PasswordReset.create({
        userId: user.id,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        used: false,
      });
    } catch (err) {
      console.error("Failed to save OTP", err);
    }

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <!-- Logo -->
        <img src="cid:app-logo" alt="App Logo" style="width: 100%; height: auto; margin-bottom: 20px;" />

        <!-- Title -->
        <h2>One Time Password (OTP)</h2>
        <p>Gunakan kode berikut untuk memvalidasi email kamu. Berlaku 10 menit.</p>

        <!-- OTP -->
        <div style="font-size: 32px; font-weight: bold; margin: 20px 0; letter-spacing: 4px;">
        ${otp}
        </div>

        <p style="font-size: 12px; color: #888;">
            Jika kamu tidak meminta reset password, abaikan email ini.
        </p>
    </div>
    `;

    await sendEmail(
      user.email,
      "Kode OTP Reset Password SkinSense",
      htmlContent,
      [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "app-logo",
        },
      ]
    );

    res
      .status(200)
      .json({ message: "If the email is registered, an OTP has been sent." });
  } catch (err) {
    console.error("Error forgot-password:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const otpEntry = await PasswordReset.findOne({
      where: { userId: user.id, otp: otp.trim(), used: false },
    });

    if (!otpEntry || otpEntry.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP is invalid or has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    otpEntry.used = true;
    await otpEntry.save();

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { forgotPassword, resetPassword };
