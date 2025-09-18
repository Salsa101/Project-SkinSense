"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RoutineProducts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      routineType: {
        type: Sequelize.ENUM("daily", "weekly", "custom"),
        allowNull: false,
      },
      timeOfDay: {
        type: Sequelize.ENUM("morning", "night"),
        allowNull: false,
      },
      reminderTime: {
        type: Sequelize.TIME,
      },
      notificationFrequency: {
        type: Sequelize.STRING,
      },
      dayOfWeek: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      customDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      productStep: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateOpened: {
        type: Sequelize.DATEONLY,
      },
      expirationDate: {
        type: Sequelize.DATEONLY,
      },
      doneDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      doneStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("RoutineProducts");
  },
};
