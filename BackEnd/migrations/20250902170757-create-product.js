"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productBrand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productStep: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productType: {
        type: Sequelize.ENUM(
          "cleanser",
          "sunscreen",
          "toner",
          "serum",
          "moisturizer",
          "mask"
        ),
        allowNull: false,
      },
      dateOpened: {
        type: Sequelize.DATEONLY,
      },
      expirationDate: {
        type: Sequelize.DATEONLY,
      },
      productImage: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Products");
  },
};
