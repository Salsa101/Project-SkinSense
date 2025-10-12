const { User } = require("../models");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "username",
        "email",
        "full_name",
        "age",
        "date_of_birth",
        "profileImage",
        "bannerImage",
        "enabledNotif",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data pengguna" });
  }
};

const notifToggle = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });

    user.enabledNotif = req.body.enabledNotif;
    await user.save();

    res.json({
      message: "Notifikasi diperbarui",
      enabledNotif: user.enabledNotif,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update notifikasi" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, age, date_of_birth } = req.body;

    const oldUser = await User.findByPk(userId);

    if (!oldUser) return res.status(404).json({ message: "User not found" });

    const profileImage = req.files?.profileImage?.[0];
    const bannerImage = req.files?.bannerImage?.[0];

    const profileImageUrl = profileImage
      ? `/uploads/${userId}/profile/${profileImage.filename}`
      : oldUser.profileImage;

    const bannerImageUrl = bannerImage
      ? `/uploads/${userId}/profile/${bannerImage.filename}`
      : oldUser.bannerImage;

    if (profileImage && oldUser.profileImage) {
      const oldPath = path.join(__dirname, "..", oldUser.profileImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    if (bannerImage && oldUser.bannerImage) {
      const oldPath = path.join(__dirname, "..", oldUser.bannerImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updateData = {
      username,
      profileImage: profileImageUrl,
      bannerImage: bannerImageUrl,
    };

    if (age && !isNaN(age)) updateData.age = parseInt(age);
    if (
      date_of_birth &&
      date_of_birth.trim() !== "" &&
      !isNaN(new Date(date_of_birth))
    )
      updateData.date_of_birth = new Date(date_of_birth);

    await User.update(updateData, { where: { id: userId } });

    const updatedUser = await User.findByPk(userId, {
      attributes: [
        "id",
        "username",
        "email",
        "age",
        "date_of_birth",
        "profileImage",
        "bannerImage",
        "enabledNotif",
      ],
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password salah" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await user.destroy();

    req.session?.destroy?.();

    return res.status(200).json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    console.error("Error delete account:", error);
    return res.status(500).json({ message: "Gagal menghapus akun" });
  }
};

const deleteData = async (req, res) => {};

module.exports = {
  getProfile,
  notifToggle,
  updateProfile,
  deleteAccount,
  changePassword,
};
