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
        title: "12 or younger",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 2,
        title: "13-22",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 2,
        title: "23-29",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 2,
        title: "30-39",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizQuestionId: 2,
        title: "40 or older",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("QuizOptions", null, {});
  },
};
