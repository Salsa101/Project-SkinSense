const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { ResultScan, QuizUserAnswer, QuizOption } = require("../models");

const runAI = (userId, filename) => {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(
      __dirname,
      "..",
      "..",
      "AiMod",
      "content",
      "datacontent",
      "test",
      "images",
      userId,
      filename
    );

    const outputPath = path.join(
      __dirname,
      "..",
      "..",
      "AiMod",
      "content",
      "datacontent",
      "result",
      userId,
      `${userId}_${filename.replace(/\.[^/.]+$/, "")}_output.jpg`
    );

    const py = spawn("python", [
      path.join(__dirname, "..", "..", "AiMod", "predict.py"),
      userId,
      inputPath,
      outputPath,
    ]);

    let resultData = "";
    py.stdout.on("data", (data) => {
      resultData += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });

    py.on("close", () => {
      const lastLine = resultData.trim().split("\n").pop();
      const [numAcne, severity] = lastLine.split("|");
      resolve({ numAcne, severity, outputPath });
    });
  });
};

const uploadFaceController = async (req, res) => {
  const userId = req.user.id;
  const filename = req.file.filename;

  const srcPath = req.file.path;

  const destDir = path.join(
    __dirname,
    "..",
    "..",
    "AiMod",
    "content",
    "datacontent",
    "test",
    "images",
    userId.toString()
  );
  const destPath = path.join(destDir, filename);

  try {
    fs.mkdirSync(destDir, { recursive: true });

    fs.renameSync(srcPath, destPath);

    const aiResult = await runAI(userId.toString(), filename);

    const uploadsDir = path.join(
      __dirname,
      "..",
      "uploads",
      userId.toString(),
      "faces"
    );
    fs.mkdirSync(uploadsDir, { recursive: true });

    const finalPath = path.join(uploadsDir, path.basename(aiResult.outputPath));
    fs.copyFileSync(aiResult.outputPath, finalPath);

    const acneCount = parseInt(aiResult.numAcne, 10);

    const skinAnswer = await QuizUserAnswer.findOne({
      where: { userId, quizQuestionId: 1 },
      include: [
        {
          model: QuizOption,
          as: "quizOption",
          attributes: ["title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const skinType = skinAnswer ? skinAnswer.quizOption.title : "Unknown";

    const lastQuiz = await QuizUserAnswer.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    // Save to DB
    const newScan = await ResultScan.create({
      userId: userId,
      imagePath: `/uploads/${userId}/faces/${path.basename(finalPath)}`,
      skinType: skinType,
      severity: aiResult.severity,
      acneCount: isNaN(acneCount) ? 0 : acneCount,
    });

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

    res.json({
      message: "Upload sukses & AI jalan, data tersimpan di DB",
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
