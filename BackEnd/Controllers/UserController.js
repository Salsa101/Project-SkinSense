const { User } = require("../models");
const fs = require("fs");
const path = require("path");

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

// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { full_name, age, date_of_birth } = req.body;

//     // Update data user
//     const [updated] = await User.update(
//       { full_name, age, date_of_birth },
//       { where: { id: userId } }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const updatedUser = await User.findByPk(userId, {
//       attributes: [
//         "id",
//         "username",
//         "email",
//         "age",
//         "date_of_birth",
//         "profileImage",
//         "bannerImage",
//         "enabledNotif",
//       ],
//     });

//     res.json({ message: "Profile updated successfully", user: updatedUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { full_name, age, date_of_birth } = req.body;

//     // Ambil URL gambar (kalau upload baru, ambil dari req.file / req.files)
//     const profileImage = req.files?.profileImage?.[0];
//     const bannerImage = req.files?.bannerImage?.[0];

//     const profileImageUrl = profileImage
//       ? `/uploads/${userId}/profile/${profileImage.filename}`
//       : req.body.profileImage || null;

//     const bannerImageUrl = bannerImage
//       ? `/uploads/${userId}/profile/${bannerImage.filename}`
//       : req.body.bannerImage || null;

//     // Update data
//     const updateData = {
//       full_name,
//       age,
//       date_of_birth,
//       ...(profileImageUrl && { profileImage: profileImageUrl }),
//       ...(bannerImageUrl && { bannerImage: bannerImageUrl }),
//     };

//     const [updated] = await User.update(updateData, { where: { id: userId } });

//     if (!updated) return res.status(404).json({ message: "User not found" });

//     const updatedUser = await User.findByPk(userId, {
//       attributes: [
//         "id",
//         "username",
//         "email",
//         "full_name",
//         "age",
//         "date_of_birth",
//         "profileImage",
//         "bannerImage",
//       ],
//     });

//     res.json({
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Failed to update profile",
//       error: error.message,
//     });
//   }
// };

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, age, date_of_birth } = req.body;

    // Ambil user lama untuk ambil path gambar sebelumnya
    const oldUser = await User.findByPk(userId);

    if (!oldUser) return res.status(404).json({ message: "User not found" });

    // Ambil file baru (kalau ada)
    const profileImage = req.files?.profileImage?.[0];
    const bannerImage = req.files?.bannerImage?.[0];

    // Buat path baru
    const profileImageUrl = profileImage
      ? `/uploads/${userId}/profile/${profileImage.filename}`
      : oldUser.profileImage;

    const bannerImageUrl = bannerImage
      ? `/uploads/${userId}/profile/${bannerImage.filename}`
      : oldUser.bannerImage;

    // Hapus file lama kalau upload baru
    if (profileImage && oldUser.profileImage) {
      const oldPath = path.join(__dirname, "..", oldUser.profileImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    if (bannerImage && oldUser.bannerImage) {
      const oldPath = path.join(__dirname, "..", oldUser.bannerImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Filter data valid
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

    // Ambil data user terbaru
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

module.exports = { getProfile, notifToggle, updateProfile, deleteAccount };
