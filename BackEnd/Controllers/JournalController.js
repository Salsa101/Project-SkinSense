const { Journal } = require("../models");

// 1. Add new journal
const addJournal = async (req, res) => {
  try {
    const { title, description, mood, journal_date } = req.body;
    const userId = req.user.id;

    const journal = await Journal.create({
      title,
      description,
      journal_image: req.file ? req.file.filename : null,
      mood,
      journal_date,
      userId,
    });

    res.status(201).json({ message: "Journal created successfully", journal });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create journal", error: err.message });
  }
};

const getJournalByDate = async (req, res) => {
  try {
    const userId = req.user.id; // dari validateToken
    const { date } = req.query; // format: 'YYYY-MM-DD'

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const journal = await Journal.findOne({
      where: {
        userId,
        journal_date: date, // sesuaikan nama field di database
      },
    });

    if (!journal) {
      return res.json(null); // kalau ga ada journal
    }

    res.json(journal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllJournal = async (req, res) => {
  try {
    const userId = req.user.id; // ambil dari token biar cuma journal user itu aja
    const journals = await Journal.findAll({
      where: { userId: userId },
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
    console.error("Error fetching journals:", error);
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
  getAllJournal,
};
