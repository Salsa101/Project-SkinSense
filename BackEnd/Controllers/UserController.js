const { User } = require("../models");

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

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, age, date_of_birth } = req.body;

    // Update data user
    const [updated] = await User.update(
      { full_name, age, date_of_birth },
      { where: { id: userId } }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: [
        "id",
        "username",
        "email",
        "full_name",
        "age",
        "date_of_birth",
      ],
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
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

module.exports = { getProfile, updateProfile, deleteAccount };
