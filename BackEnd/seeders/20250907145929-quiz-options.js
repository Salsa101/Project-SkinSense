"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("QuizOptions", [
      {
        quizQuestionId: 1,
        title: "Normal",
        description:
          "Feels balanced, not too oily or dry. Smooth texture with few imperfections",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 1,
        title: "Oily",
        description:
          "Shiny, especially on the T-zone. Prone to acne and large pores.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 1,
        title: "Dry",
        description: "Feels tight or rough, may appear flaky or dull",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 1,
        title: "Combination",
        description: "Oily in the T-zone, but dry or normal on the cheeks",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 1,
        title: "I don’t know",
        description: "Help me find out about my skin type",
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
