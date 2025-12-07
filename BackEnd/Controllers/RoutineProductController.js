const { RoutineProduct, Product } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { uploadToCloudinary } = require("../Middlewares/UploadImage");
const cloudinary = require("cloudinary").v2;

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
      productStep,
      dateOpened,
      isOpened,
      routineType,
      timeOfDay,
      dayOfWeek,
      customDate,
      paoMonths,
      hasPao,
    } = req.body;

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

    // --- Cloudinary upload ---
    let imageUrl = null;
    let publicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        `${userId}/products`
      );
      imageUrl = result.secure_url; // <-- simpan URL Cloudinary
      publicId = result.public_id;
    }

    let finalProductId = productId;
    let existingProduct = null;
    let newProduct = null;

    if (!finalProductId) {
      if (!productName || !productBrand || !productType) {
        return res
          .status(400)
          .json({ message: "Data produk tidak lengkap untuk input manual." });
      }

      existingProduct = await Product.findOne({
        where: { productName, productBrand, productType },
      });

      if (existingProduct) {
        finalProductId = existingProduct.id;
      } else {
        newProduct = await Product.create({
          userId,
          productName,
          productBrand,
          productType,
          productImage: imageUrl,
          isVerified: false,
          shelf_life_months: shelfLifeDefaults[productType] || 6,
        });
        finalProductId = newProduct.id;
      }
    }

    const parsedHasPao =
      typeof hasPao === "string"
        ? hasPao === "true" || hasPao === "yes"
        : !!hasPao;

    const finalPaoMonths = parsedHasPao
      ? parseInt(paoMonths) || 6
      : existingProduct?.shelf_life_months ||
        newProduct?.shelf_life_months ||
        shelfLifeDefaults[productType] ||
        6;

    let expirationDate = null;
    if (isOpened === "yes" && dateOpened) {
      const baseDate = new Date(dateOpened);
      expirationDate = new Date(
        baseDate.setMonth(baseDate.getMonth() + finalPaoMonths)
      );
    } else if (isOpened === "no" && req.body.expirationDate) {
      expirationDate = new Date(req.body.expirationDate);
    }

    let existingStep = await RoutineProduct.findOne({
      where: { userId, routineType, timeOfDay, productStep },
    });

    if (existingStep) {
      await existingStep.update({
        productId: finalProductId,
        dateOpened,
        expirationDate,
        dayOfWeek: dayOfWeekArray,
        customDate,
        isOpened,
        hasPao: parsedHasPao,
        paoMonths: finalPaoMonths,
      });
      return res.status(200).json({
        message: `Step ${productStep} di ${routineType} ${timeOfDay} berhasil diupdate.`,
        routineProduct: existingStep,
      });
    }

    const routineProduct = await RoutineProduct.create({
      userId,
      productId: finalProductId,
      productStep,
      dateOpened,
      expirationDate,
      routineType,
      timeOfDay,
      dayOfWeek: dayOfWeekArray,
      customDate,
      isOpened,
      hasPao: parsedHasPao,
      paoMonths: finalPaoMonths,
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
      order: [["productStep", "ASC"]],
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
    const { date } = req.query; // new

    const today = date ? new Date(date) : new Date();
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
            customDate: todayDate,
          },
        ],
      },
      include: [{ model: Product }],
      order: [["productStep", "ASC"]],
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

    // --- handle dayOfWeek dan customDate ---
    let dayOfWeek = routine.dayOfWeek;
    if (req.body.dayOfWeek) {
      const parsed = JSON.parse(req.body.dayOfWeek);
      dayOfWeek = Array.isArray(parsed) ? parsed : [];
    }

    let customDate = routine.customDate;
    if (req.body.customDate && req.body.customDate !== "null") {
      customDate = req.body.customDate;
    } else {
      customDate = null;
    }

    // --- update RoutineProduct ---
    await routine.update({
      productStep: req.body.productStep || routine.productStep,
      routineType: req.body.routineType || routine.routineType,
      dayOfWeek,
      customDate,
      timeOfDay: req.body.timeOfDay || routine.timeOfDay,
      dateOpened: req.body.dateOpened || routine.dateOpened,
      expirationDate: req.body.expirationDate || routine.expirationDate,
      isOpened: req.body.isOpened || routine.isOpened,
      hasPao: req.body.hasPao ?? routine.hasPao,
      paoMonths:
        req.body.paoMonths !== undefined
          ? parseInt(req.body.paoMonths, 10)
          : routine.paoMonths,
    });

    // --- update Product jika ada dan belum verified ---
    if (routine.Product && !routine.Product.isVerified) {
      const updateData = {
        productName: req.body.productName || routine.Product.productName,
        productBrand: req.body.productBrand || routine.Product.productBrand,
        productType: req.body.productType || routine.Product.productType,
      };

      if (req.file) {
        // hapus file lama di Cloudinary kalau ada
        if (routine.Product.productImage) {
          const parts = routine.Product.productImage.split("/upload/");
          const publicIdWithExt = parts[1];
          const publicId = publicIdWithExt
            .split("/")
            .slice(1)
            .join("/")
            .split(".")[0];

          await cloudinary.uploader.destroy(publicId);
        }

        // upload file baru dari buffer
        const result = await uploadToCloudinary(
          req.file.buffer,
          `${req.user.id}/products`
        );
        updateData.productImage = result.secure_url;
        updateData.productImagePublicId = result.public_id;
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
    const imageUrl = `/uploads/${req.user.id}/products/${req.file.filename}`;

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
