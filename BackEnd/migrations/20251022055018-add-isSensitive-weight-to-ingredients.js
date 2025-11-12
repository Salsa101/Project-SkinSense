"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Ingredients", "isSensitive", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // set a default for existing rows
    });

    await queryInterface.addColumn("Ingredients", "isOily", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // set default weight
    });

    await queryInterface.addColumn("Ingredients", "weight", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0, // set default weight
    });

    await queryInterface.addColumn("Ingredients", "skinTypes", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.addColumn("Ingredients", "tags", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Ingredients", "isSensitive");
    await queryInterface.removeColumn("Ingredients", "isOily");
    await queryInterface.removeColumn("Ingredients", "weight");
    await queryInterface.removeColumn("Ingredients", "skinTypes");
    await queryInterface.removeColumn("Ingredients", "tags");
  },
};
