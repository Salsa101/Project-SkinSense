"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("QuizQuestions", [
      {
        quizQuestion: "What’s your skin type?",
        description: "Pilih jawaban yang paling benar.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestion: "What’s your age range?",
        description: "Pilih jawaban yang paling benar.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("QuizQuestions", null, {});
  },
};
