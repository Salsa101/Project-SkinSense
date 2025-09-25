const { RoutineProduct, Product } = require("../models");
const { Op } = require("sequelize");

const shelfLifeDefaults = {
  cleanser: 12,
  sunscreen: 12,
  toner: 12,
  serum: 6,
  moisturizer: 12,
  mask: 3,
};

// Add product ke routine
const addProductToRoutine = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      productId,
      productName,
      productBrand,
      productType,
      productImage,
      productStep,
      dateOpened,
      expirationDate,
      isOpened,
      routineType,
      timeOfDay,
      reminderTime,
      dayOfWeek,
      customDate,
    } = req.body;

    // parsing dayOfWeek
    let dayOfWeekArray = [];
    if (dayOfWeek) {
      try {
        dayOfWeekArray = Array.isArray(dayOfWeek)
          ? dayOfWeek
          : JSON.parse(dayOfWeek);
      } catch {
        dayOfWeekArray = [];
      }
    }

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : productImage || null;

    let finalProductId = productId;

    if (!finalProductId) {
      // input manual → cek apakah produk dengan data sama sudah ada
      if (!productName || !productBrand || !productType) {
        return res
          .status(400)
          .json({ message: "Data produk tidak lengkap untuk input manual." });
      }

      let existingProduct = await Product.findOne({
        where: { productName, productBrand, productType },
      });

      if (existingProduct) {
        finalProductId = existingProduct.id;
      } else {
        const newProduct = await Product.create({
          userId,
          productName,
          productBrand,
          productType,
          productImage: imageUrl,
          isVerified: false, // default
          shelf_life_months: shelfLifeDefaults[productType] || 6,
        });
        finalProductId = newProduct.id;
      }
    }

    // cek apakah routine product dengan step yg sama sudah ada
    let existingStep = await RoutineProduct.findOne({
      where: { userId, routineType, timeOfDay, productStep },
    });

    if (existingStep) {
      await existingStep.update({
        productId: finalProductId,
        dateOpened,
        expirationDate,
        reminderTime,
        dayOfWeek: dayOfWeekArray,
        customDate,
        isOpened,
      });
      return res.status(200).json({
        message: `Step ${productStep} di ${routineType} ${timeOfDay} berhasil diupdate.`,
        routineProduct: existingStep,
      });
    }

    // kalau belum ada → create baru
    const routineProduct = await RoutineProduct.create({
      userId,
      productId: finalProductId,
      productStep,
      dateOpened,
      expirationDate,
      routineType,
      timeOfDay,
      reminderTime,
      dayOfWeek: dayOfWeekArray,
      customDate,
      isOpened,
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
        ["productStep", "ASC"],
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
        ["productStep", "ASC"],
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

// Get detail product
const getRoutineProduct = async (req, res) => {
  try {
    const routine = await RoutineProduct.findByPk(req.params.id, {
      include: [Product], // ikut ambil detail product
    });
    if (!routine) return res.status(404).json({ message: "Not found" });

    res.json(routine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
const updateRoutineProduct = async (req, res) => {
  try {
    const routine = await RoutineProduct.findByPk(req.params.id, {
      include: [Product],
    });
    if (!routine) return res.status(404).json({ message: "Not found" });

    // update RoutineProduct (selalu boleh diubah)
    await routine.update({
      productStep: req.body.productStep || routine.productStep,
      routineType: req.body.routineType || routine.routineType,
      routineDay: req.body.routineDay || routine.routineDay,
      customDate: req.body.customDate || routine.customDate,
      timeOfDay: req.body.timeOfDay || routine.timeOfDay,
      dateOpened: req.body.dateOpened || routine.dateOpened,
      expirationDate: req.body.expirationDate || routine.expirationDate,
      reminderTime: req.body.reminderTime || routine.reminderTime,
      isOpened: req.body.isOpened || routine.isOpened,
    });

    // cek verifikasi sebelum update Product
    if (routine.Product && !routine.Product.isVerified) {
      const updateData = {
        productName: req.body.productName || routine.Product.productName,
        productBrand: req.body.productBrand || routine.Product.productBrand,
        productType: req.body.productType || routine.Product.productType,
      };

      if (req.file) {
        updateData.productImage = `/uploads/${req.file.filename}`;
      }

      await routine.Product.update(updateData);
    }

    const updated = await RoutineProduct.findByPk(req.params.id, {
      include: [Product],
    });

    res.json({ message: "Routine + Product updated", routine: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete
const deleteRoutineProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routineProductId } = req.body;

    if (!routineProductId) {
      return res.status(400).json({ error: "routineProductId is required" });
    }

    const routineProduct = await RoutineProduct.findOne({
      where: { id: routineProductId, userId },
    });

    if (!routineProduct) {
      return res.status(404).json({ error: "Not found or not yours" });
    }

    await routineProduct.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search Product
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.json([]);
    }

    const whereCondition = {
      [Op.or]: [
        { productName: { [Op.iLike]: `%${query}%` } },
        { productBrand: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (!req.user || req.user.role !== "admin") {
      whereCondition.isVerified = true;
    }

    const products = await Product.findAll({
      where: whereCondition,
      attributes: [
        "id",
        "productName",
        "productBrand",
        "productType",
        "productImage",
        "isVerified",
        "shelf_life_months",
      ],
      limit: 10,
    });

    res.json(products);
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
  searchProducts,
};
