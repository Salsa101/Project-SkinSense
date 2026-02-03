const { QuizQuestion, QuizOption, QuizUserAnswer } = require("../models");

const getQuestions = async (req, res) => {
  try {
    const questions = await QuizQuestion.findAll({
      include: [
        { model: QuizOption, as: "quizOptions", attributes: ["id", "title", "description"] },
      ],
    });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal ambil pertanyaan" });
  }
};

const submitAnswers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body;

    const created = await Promise.all(
      answers.map((ans) =>
        QuizUserAnswer.create({
          userId,
          quizQuestionId: ans.quizQuestionId,
          quizOptionId: ans.quizOptionId,
        })
      )
    );

    res.json({ message: "Jawaban berhasil disimpan", data: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal simpan jawaban" });
  }
};

module.exports = {
  getQuestions,
  submitAnswers,
};
