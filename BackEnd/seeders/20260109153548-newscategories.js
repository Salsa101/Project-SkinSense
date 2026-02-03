"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "NewsCategories",
      [
        {
          newsId: 1,
          categoryId: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          newsId: 2,
          categoryId: 2,
          createdAt: now,
          updatedAt: now,
        },
        {
          newsId: 3,
          categoryId: 3,
          createdAt: now,
          updatedAt: now,
        },
        {
          newsId: 4,
          categoryId: 3,
          createdAt: now,
          updatedAt: now,
        },
        {
          newsId: 5,
          categoryId: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          newsId: 6,
          categoryId: 3,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("NewsCategories", null, {});
  },
};
