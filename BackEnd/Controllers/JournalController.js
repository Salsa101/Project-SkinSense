const { Journal } = require("../models");
const { Op } = require("sequelize");

// 1. Add new journal
const addJournal = async (req, res) => {
  try {
    const { title, description, mood, journal_date } = req.body;
    const userId = req.user.id;

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.journal_image || null;

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

    await journal.update({
      title,
      description,
      journal_image: req.file ? req.file.filename : journal.journal_image,
      mood,
      journal_date,
    });

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
