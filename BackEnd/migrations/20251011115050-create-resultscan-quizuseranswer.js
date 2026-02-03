"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ResultScanQuizUserAnswer", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      resultScanId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "ResultScans", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quizUserAnswerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "QuizUserAnswers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ResultScanQuizUserAnswer");
  },
};
