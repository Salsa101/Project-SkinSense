const { Journal } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { uploadToCloudinary } = require("../Middlewares/UploadImage");
const cloudinary = require("cloudinary").v2;

const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Gagal hapus file:", err);
  }
};

// 1. Add new journal
const addJournal = async (req, res) => {
  try {
    const { title, description, mood, journal_date } = req.body;
    const userId = req.user.id;

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        `${userId}/journals`
      );
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    } else if (req.body.journal_image) {
      imageUrl = req.body.journal_image;
    }

    const journal = await Journal.create({
      title,
      description,
      journal_image: imageUrl,
      mood,
      journal_date,
      userId,
    });

    res.status(201).json({
      message: "Journal created successfully",
      journal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create journal",
      error: err.message,
    });
  }
};

const getJournalByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const journal = await Journal.findOne({
      where: {
        userId,
        journal_date: date,
      },
    });

    if (!journal) {
      return res.json(null);
    }

    res.json(journal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getJournalsByMonth = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required (YYYY-MM)" });
    }

    const journals = await Journal.findAll({
      where: {
        userId,
        journal_date: {
          [Op.between]: [new Date(`${month}-01`), new Date(`${month}-31`)],
        },
      },
      attributes: [
        "id",
        "title",
        "description",
        "journal_image",
        "mood",
        "journal_date",
      ],
      order: [["journal_date", "DESC"]],
    });

    res.json(journals);
  } catch (error) {
    console.error("Error fetching journals by month:", error);
    res.status(500).json({ message: "Failed to fetch journals" });
  }
};

// 2. Get journal detail by id
const getJournalDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const journal = await Journal.findOne({
      where: { id, userId: req.user.id },
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to get journal", error: err.message });
  }
};

// 3. Update journal
const updateJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, journal_image, mood, journal_date } = req.body;

    const journal = await Journal.findOne({
      where: { id, userId: req.user.id },
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    let updateData = {
      title,
      description,
      mood,
      journal_date,
    };

    if (req.file) {
      if (journal.journal_image) {
        // ambil public_id dari URL lama
        const parts = journal.journal_image.split("/upload/");
        const publicIdWithExt = parts[1];
        const publicId = publicIdWithExt
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        `${req.user.id}/journals`
      );
      updateData.journal_image = result.secure_url;
    } else if (journal_image) {
      if (journal.journal_image) {
        const parts = journal.journal_image.split("/upload/");
        const publicIdWithExt = parts[1];
        const publicId = publicIdWithExt
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      updateData.journal_image = journal_image;
    }

    await journal.update(updateData);

    res.json({ message: "Journal updated successfully", journal });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update journal", error: err.message });
  }
};

// 4. Delete journal
const deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const journal = await Journal.findOne({
      where: { id, userId: req.user.id },
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    // --- hapus file di Cloudinary kalau ada ---
    if (journal.journal_image) {
      try {
        // ambil public_id dari URL
        const parts = journal.journal_image.split("/upload/");
        const publicIdWithExt = parts[1];
        const publicId = publicIdWithExt
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0];

        await cloudinary.uploader.destroy(publicId, { invalidate: true });
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err.message);
      }
    }

    // --- hapus journal dari DB ---
    await journal.destroy();

    res.json({ message: "Journal deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to delete journal", error: err.message });
  }
};

module.exports = {
  addJournal,
  getJournalDetail,
  updateJournal,
  deleteJournal,
  getJournalByDate,
  getJournalsByMonth,
};
