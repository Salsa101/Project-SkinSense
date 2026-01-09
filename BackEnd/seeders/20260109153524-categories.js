"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          name: "Skincare Trends",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Skincare Tips",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Acne Care",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
