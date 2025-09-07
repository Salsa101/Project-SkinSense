"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("QuizOptions", [
      {
        quizQuestionId: 1, // sesuaikan ID pertanyaan
        title: "Biru",
        description: "Langit biasanya biru saat cerah",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 1,
        title: "Hijau",
        description: "Kadang terlihat hijau karena pantulan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 2,
        title: "4",
        description: "Jawaban matematika yang benar",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 2,
        title: "5",
        description: "Jawaban salah",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("QuizOptions", null, {});
  },
};
