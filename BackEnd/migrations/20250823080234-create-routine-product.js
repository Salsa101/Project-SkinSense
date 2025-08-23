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
      category: {
        type: Sequelize.ENUM("daily", "weekly", "custom"),
        allowNull: false,
      },
      routineName: {
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
        type: Sequelize.ENUM(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ),
        allowNull: true,
      },
      customDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
          key: "id",
        },
        onDelete: "CASCADE",
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
