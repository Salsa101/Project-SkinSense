const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { ResultScan, QuizUserAnswer, QuizOption } = require("../models");
const { uploadToCloudinary } = require("../Middlewares/UploadImage");

const runAI = (userId, inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [
      path.join(__dirname, "..", "..", "AiMod", "predict.py"),
      userId,
      inputPath,
      outputPath,
    ]);

    let resultData = "";
    py.stdout.on("data", (data) => (resultData += data.toString()));
    py.stderr.on("data", (data) =>
      console.error("Python error:", data.toString())
    );

    py.on("close", (code) => {
      if (code !== 0)
        return reject(new Error("Python process exited with error"));
      const lastLine = resultData.trim().split("\n").pop();
      const [numAcne, severity] = lastLine.split("|");
      resolve({ numAcne, severity, outputPath });
    });
  });
};

const uploadFaceController = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file || !req.file.buffer)
      return res.status(400).json({ error: "File tidak ada" });

    // ▪ Buat temporary input file
    const inputTempPath = path.join(
      os.tmpdir(),
      `${userId}_${Date.now()}_input.jpg`
    );
    fs.writeFileSync(inputTempPath, req.file.buffer);

    // ▪ Buat temporary output file
    const outputTempPath = path.join(
      os.tmpdir(),
      `${userId}_${Date.now()}_output.jpg`
    );

    // ▪ Jalankan AI
    const aiResult = await runAI(
      userId.toString(),
      inputTempPath,
      outputTempPath
    );

    // ▪ Upload hasil ke Cloudinary
    const cloudResult = await uploadToCloudinary(
      fs.readFileSync(aiResult.outputPath),
      `${userId}/faces`,
      `${userId}_${Date.now()}_output`
    );

    // ▪ Ambil skin type dari quiz
    const acneCount = parseInt(aiResult.numAcne, 10);
    const skinAnswer = await QuizUserAnswer.findOne({
      where: { userId, quizQuestionId: 1 },
      include: [{ model: QuizOption, as: "quizOption", attributes: ["title"] }],
      order: [["createdAt", "DESC"]],
    });
    const skinType = skinAnswer ? skinAnswer.quizOption.title : "Unknown";

    // ▪ Simpan ke DB
    const newScan = await ResultScan.create({
      userId,
      imagePath: cloudResult.secure_url,
      skinType,
      severity: aiResult.severity,
      acneCount: isNaN(acneCount) ? 0 : acneCount,
    });

    // ▪ Tambahkan quiz answers terakhir
    const lastQuizAnswers = await QuizUserAnswer.findAll({
      where: { userId },
      attributes: ["id", "quizQuestionId", "quizOptionId", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    const uniqueAnswers = Object.values(
      lastQuizAnswers.reduce((acc, ans) => {
        if (!acc[ans.quizQuestionId]) acc[ans.quizQuestionId] = ans;
        return acc;
      }, {})
    );
    await newScan.addQuizAnswers(uniqueAnswers.map((q) => q.id));

    // ▪ Hapus file sementara
    fs.unlinkSync(inputTempPath);
    fs.unlinkSync(outputTempPath);

    res.json({
      message: "Upload sukses & AI jalan, hasil tersimpan di Cloudinary",
      scan: newScan,
    });
  } catch (err) {
    console.error("UploadFace error:", err);
    res.status(500).json({ error: err.message });
  }
};

const getFaceResultController = async (req, res) => {
  try {
    const userId = req.user.id;
    const scans = await ResultScan.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "imagePath",
        "skinType",
        "severity",
        "acneCount",
        "createdAt",
        "updatedAt",
      ],
    });
    res.json({ scans });
  } catch (err) {
    console.error("GetScans error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadFaceController, getFaceResultController };
