const { ReminderTime, RoutineProduct, Product } = require("../models");
const { Op } = require("sequelize");

const getReminderNotifications = async (req, res) => {
  try {
    const reminders = await ReminderTime.findAll({
      attributes: ["id", "timeOfDay", "reminderTime"],
      order: [["reminderTime", "ASC"]],
    });

    res.json(reminders);
  } catch (error) {
    console.error("Error fetching reminder times:", error);
    res.status(500).json({ message: "Failed to fetch reminder times" });
  }
};

const getRoutineProductNotifications = async (req, res) => {
  try {
    const now = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(now.getDate() + 14);

    const products = await RoutineProduct.findAll({
      where: {
        expirationDate: {
          [Op.lte]: twoWeeksLater,
          [Op.gt]: now,
        },
      },
      include: [
        {
          model: Product,
          attributes: ["productName"],
        },
      ],
      attributes: ["id", "productId", "expirationDate"],
      order: [["expirationDate", "ASC"]],
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching routine products:", error);
    res.status(500).json({ message: "Failed to fetch routine products" });
  }
};

module.exports = { getReminderNotifications, getRoutineProductNotifications };
