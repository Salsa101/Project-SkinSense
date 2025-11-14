"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const { Op } = Sequelize;
     await queryInterface.sequelize.query(`TRUNCATE TABLE "Ingredients" RESTART IDENTITY CASCADE;`);
    const now = new Date();
    await queryInterface.bulkInsert(
      "Ingredients",
      [
        {
          name: "Hyaluronic Acid",
          isSensitive: false,
          isOily: false,
          weight: 1.0,
          skinTypes: ["dry", "normal", "combination", "sensitive"],
          tags: ["hydration", "humectant", "hyaluronic acid"],
          isPregnancySafe: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Niacinamide",
          isSensitive: false,
          isOily: false,
          weight: 1.0,
          skinTypes: ["oily", "combination", "sensitive", "normal"],
          tags: ["sebum_regulation", "brightening", "niacinamide"],
          isPregnancySafe: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Salicylic Acid",
          isSensitive: true,
          isOily: true,
          weight: 0.9,
          skinTypes: ["oily", "combination"],
          tags: ["exfoliation", "bha", "salicylic acid"],
          isPregnancySafe: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Retinol",
          isSensitive: true,
          isOily: false,
          weight: 0.95,
          skinTypes: ["normal", "oily", "combination"],
          tags: ["retinol", "anti_aging", "cell_turnover"],
          isPregnancySafe: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Benzoyl Peroxide",
          isSensitive: true,
          isOily: true,
          weight: 0.85,
          skinTypes: ["oily", "combination"],
          tags: ["antibacterial", "acne_treatment", "benzoyl peroxide"],
          isPregnancySafe: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Zinc Oxide",
          isSensitive: false,
          isOily: false,
          weight: 0.8,
          skinTypes: ["all"],
          tags: ["sunscreen", "physical", "zinc oxide"],
          isPregnancySafe: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Shea Butter",
          isSensitive: false,
          isOily: true,
          weight: 0.6,
          skinTypes: ["dry", "normal"],
          tags: ["emollient", "moisturizing", "shea butter"],
          isPregnancySafe: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Squalane",
          isSensitive: false,
          isOily: false,
          weight: 0.9,
          skinTypes: ["all"],
          tags: ["lightweight_moisturizer", "barrier_support", "squalane"],
          isPregnancySafe: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Aloe Vera",
          isSensitive: true,
          isOily: false,
          weight: 0.5,
          skinTypes: ["sensitive", "all"],
          tags: ["soothing", "hydration", "aloe vera"],
          isPregnancySafe: true,
          createdAt: now,
          updatedAt: now,
        },
          {
          name: "Ceramides",
          isSensitive: true,
          isOily: false,
          weight: 0.5,
          skinTypes: ["sensitive", "all"],
          tags: ["soothing", "hydration", "aloe vera"],
          isPregnancySafe: true,
          createdAt: now,
          updatedAt: now,
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      "Ingredients",
      {
        name: {
          [Op.in]: [
            "Hyaluronic Acid",
            "Niacinamide",
            "Salicylic Acid",
            "Retinol",
            "Benzoyl Peroxide",
            "Zinc Oxide",
            "Shea Butter",
            "Squalane",
            "Aloe Vera",
          ],
        },
      },
      {}
    );
  },
};