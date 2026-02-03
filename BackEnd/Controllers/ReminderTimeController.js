const { ReminderTime } = require("../models");

const createReminderTime = async (req, res) => {
  try {
    const userId = req.user.id; // <- fix sini
    const { timeOfDay, reminderTime } = req.body;

    const existing = await ReminderTime.findOne({
      where: { userId, timeOfDay },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: `${timeOfDay} reminder already exists` });
    }

    const reminder = await ReminderTime.create({
      userId,
      timeOfDay,
      reminderTime: reminderTime || null,
      enabled: true,
    });

    res
      .status(201)
      .json({ message: `${timeOfDay} reminder created`, reminder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create reminder time" });
  }
};

const getAllReminderTimes = async (req, res) => {
  try {
    const userId = req.user.id;

    const times = await ReminderTime.findAll({
      where: { userId },
    });

    res.status(200).json(times);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reminder times" });
  }
};

const updateReminderTime = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeOfDay } = req.params;
    const { reminderTime } = req.body;

    const reminder = await ReminderTime.findOne({
      where: { userId, timeOfDay },
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    reminder.reminderTime = reminderTime;
    await reminder.save();

    res
      .status(200)
      .json({ message: `${timeOfDay} reminder updated`, reminder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update reminder time" });
  }
};

const toggleReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeOfDay } = req.params;

    const reminder = await ReminderTime.findOne({
      where: { userId, timeOfDay },
    });

    if (!reminder)
      return res.status(404).json({ message: "Reminder not found" });

    reminder.enabled = !reminder.enabled;
    await reminder.save();

    res.status(200).json({
      message: `${timeOfDay} reminder ${
        reminder.enabled ? "enabled" : "disabled"
      }`,
      reminder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle reminder" });
  }
};

module.exports = {
  createReminderTime,
  getAllReminderTimes,
  updateReminderTime,
  toggleReminder,
};
