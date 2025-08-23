const { RoutineProduct, Product } = require("../models");
const { Op } = require("sequelize");

// Add product ke routine
const addProductToRoutine = async (req, res) => {
  try {
    const { routineName, category } = req.params;
    const {
      productName,
      brand,
      type,
      dateOpened,
      expirationDate,
      reminderTime,
      notificationFrequency,
      dayOfWeek,
      customDate,
    } = req.body;

    const product = await Product.create({
      productName,
      brand,
      type,
      dateOpened,
      expirationDate,
    });

    const routineProduct = await RoutineProduct.create({
      productId: product.id,
      routineName,
      category,
      reminderTime,
      notificationFrequency,
      dayOfWeek,
      customDate,
    });

    res.status(201).json(routineProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View gabungan pagi/malam
const viewRoutineByTime = async (req, res) => {
  try {
    const { routineName } = req.params;
    const today = new Date();
    const dayName = today.toLocaleString("en-US", { weekday: "long" });
    const todayDate = today.toISOString().split("T")[0];

    const products = await RoutineProduct.findAll({
      where: {
        routineName,
        [Op.or]: [
          { category: "daily" },
          { category: "weekly", dayOfWeek: dayName },
          { category: "custom", customDate: todayDate },
        ],
      },
      include: [{ model: Product }],
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View spesifik per kategori & routineName
const viewRoutineByCategory = async (req, res) => {
  try {
    const { routineName, category } = req.params;
    const products = await RoutineProduct.findAll({
      where: { routineName, category },
      include: [{ model: Product }],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get detail
const getRoutineProduct = async (req, res) => {
  try {
    const data = await RoutineProduct.findByPk(req.params.id, {
      include: [Product],
    });
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
const updateRoutineProduct = async (req, res) => {
  try {
    const {
      productName,
      brand,
      type,
      dateOpened,
      expirationDate,
      routineName,
      category,
      reminderTime,
      notificationFrequency,
      dayOfWeek,
      customDate,
    } = req.body;

    const routineProduct = await RoutineProduct.findByPk(req.params.id);
    if (!routineProduct) return res.status(404).json({ error: "Not found" });

    const product = await Product.findByPk(routineProduct.productId);
    if (product) {
      await product.update({
        productName,
        brand,
        type,
        dateOpened,
        expirationDate,
      });
    }

    await routineProduct.update({
      routineName,
      category,
      reminderTime,
      notificationFrequency,
      dayOfWeek,
      customDate,
    });

    res.json(routineProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
const deleteRoutineProduct = async (req, res) => {
  try {
    const routineProduct = await RoutineProduct.findByPk(req.params.id);
    if (!routineProduct) return res.status(404).json({ error: "Not found" });

    await Product.destroy({ where: { id: routineProduct.productId } });
    await routineProduct.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addProductToRoutine,
  viewRoutineByCategory,
  viewRoutineByTime,
  getRoutineProduct,
  updateRoutineProduct,
  deleteRoutineProduct,
};
