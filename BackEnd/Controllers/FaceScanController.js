// const { exec } = require("child_process");

// const uploadFaceController = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     console.log("Face photo saved at:", req.file.path);

//     // Panggil Python AI
//     exec(`python3 ai_process.py ${req.file.path}`, (err, stdout, stderr) => {
//       if (err) {
//         console.error("Python AI error:", err);
//         return res.status(500).json({ error: "AI processing failed" });
//       }
//       console.log("Python AI output:", stdout);
//       res.json({ message: "Photo uploaded and processed", result: stdout });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };

// module.exports = {
//   uploadFaceController,
// };

const uploadFaceController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log("Face photo saved at:", req.file.path);

    // Hanya upload dulu, Python AI nanti
    res.json({
      message: "Photo uploaded successfully",
      filePath: req.file.path,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  uploadFaceController,
};
