"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("QuizQuestions", [
      {
        quizQuestion: "Apa warna langit di siang hari?",
        description: "Pilih jawaban yang paling benar.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestion: "Berapa hasil 2 + 2?",
        description: "Hitung dengan benar ya.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("QuizQuestions", null, {});
  },
};
