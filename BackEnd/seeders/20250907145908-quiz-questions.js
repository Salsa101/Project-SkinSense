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
      {
        quizQuestion: "How often do you use skincare everyday?",
        description: "Pilih jawaban yang paling benar.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestion: "Do you have sensitive skin?",
        description: "Pilih jawaban yang paling benar.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestion: "What is your main skin concern?",
        description: "Pilih jawaban yang paling benar.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestion: "Do you use sunscreen daily?",
        description: "Pilih jawaban yang paling benar.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestion: "Are you currently pregnant and breastfeeding?",
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
