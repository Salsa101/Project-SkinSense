"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const mapping = [
      { product_id: 1, ingredients: [1, 9, 10, 12] },
      { product_id: 2, ingredients: [2, 6, 11] },
      { product_id: 3, ingredients: [3, 8, 11, 10] },
      { product_id: 4, ingredients: [4, 1, 10, 5] },
      { product_id: 5, ingredients: [5, 9, 12] },
      { product_id: 6, ingredients: [6, 11, 1, 7] },
      { product_id: 7, ingredients: [7, 10, 2, 11] },
      { product_id: 8, ingredients: [8, 9] },
      { product_id: 9, ingredients: [9, 1, 12] },
      { product_id: 10, ingredients: [10, 1, 8, 11, 3] },
    ];

    const rows = [];

    mapping.forEach((map) => {
      map.ingredients.forEach((ing) => {
        rows.push({
          product_id: map.product_id,
          ingredients_id: ing,
          createdAt: now,
          updatedAt: now,
        });
      });
    });

    await queryInterface.bulkInsert("ProductIngredients", rows, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductIngredients", null, {});
  },
};
