const { RoutineProduct, Product } = require("../models");
const { Op } = require("sequelize");

// Add product ke routine
const addProductToRoutine = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      productName,
      productBrand,
      productStep,
      productType,
      dateOpened,
      expirationDate,
      routineType,
      timeOfDay,
      reminderTime,
      dayOfWeek,
      customDate,
    } = req.body;

    const existingStep = await RoutineProduct.findOne({
      where: {
        userId,
        routineType,
        timeOfDay,
      },
      include: [
        {
          model: Product,
          where: { productStep },
        },
      ],
    });

    if (existingStep) {
      return res.status(400).json({
        message: `Step ${productStep} sudah dipakai di ${routineType} ${timeOfDay}.`,
      });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({
      userId,
      productName,
      productBrand,
      productStep,
      productType,
      dateOpened,
      expirationDate,
      productImage: imageUrl,
    });

    let dayOfWeekArray = [];
    if (req.body.dayOfWeek) {
      try {
        dayOfWeekArray = JSON.parse(req.body.dayOfWeek);
      } catch (e) {
        dayOfWeekArray = [];
      }
    }

    const routineProduct = await RoutineProduct.create({
      userId,
      productId: product.id,
      routineName: timeOfDay,
      routineType,
      timeOfDay,
      category: routineType,
      reminderTime,
      dayOfWeek: dayOfWeekArray,
      customDate,
    });

    res.status(201).json(routineProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const toggleDone = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routineProductId } = req.body;

    const routineProduct = await RoutineProduct.findOne({
      where: { id: routineProductId, userId },
      include: [{ model: Product }],
    });

    if (!routineProduct)
      return res.status(404).json({ message: "Routine not found" });

    routineProduct.doneStatus = !routineProduct.doneStatus;
    await routineProduct.save();

    const today = new Date().toISOString().split("T")[0];
    const dayName = new Date()
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await RoutineProduct.findAll({
      where: {
        userId,
        timeOfDay: routineProduct.timeOfDay,
        [Op.or]: [
          { routineType: "daily" },
          { routineType: "weekly", dayOfWeek: { [Op.contains]: [dayName] } },
          {
            routineType: "custom",
            customDate: { [Op.between]: [startOfDay, endOfDay] },
          },
        ],
      },
      include: [{ model: Product }],
      order: [
        ["reminderTime", "ASC"],
        [Product, "productStep", "ASC"],
      ],
    });

    res.json(
      tasks.map((t) => ({
        ...t.toJSON(),
        done: t.doneStatus,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View gabungan pagi/malam
const viewRoutineByTime = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routineName } = req.params;

    const today = new Date();
    const dayName = today
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();
    const todayDate = today.toISOString().split("T")[0]; 

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const products = await RoutineProduct.findAll({
      where: {
        timeOfDay: routineName,
        userId,
        [Op.or]: [
          { routineType: "daily" },

          {
            routineType: "weekly",
            dayOfWeek: { [Op.contains]: [dayName] },
          },

          {
            routineType: "custom",
            customDate: { [Op.between]: [startOfDay, endOfDay] },
          },
        ],
      },
      include: [{ model: Product }],
      order: [
        ["reminderTime", "ASC"],
        [Product, "productStep", "ASC"],
      ],
    });

    const result = products.map((p) => ({
      ...p.toJSON(),
      done: p.doneDate === todayDate,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// View spesifik per kategori & routineName
const viewRoutineByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routineType, timeOfDay } = req.params;
    const products = await RoutineProduct.findAll({
      where: { userId, routineType, timeOfDay },
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

const uploadProduct = async (req, res) => {
  try {
    console.log("File:", req.file);
    console.log("Body:", req.body);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { productName, productBrand, productType } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const product = await Product.create({
      productName,
      productBrand,
      productType,
      image: imageUrl,
    });

    res.json({ success: true, imageUrl, product });
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
  uploadProduct,
  toggleDone,
};
