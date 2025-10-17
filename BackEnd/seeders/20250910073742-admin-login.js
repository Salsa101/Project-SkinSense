"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("adminbksgurls", 10); // hash password

    await queryInterface.bulkInsert("Users", [
      {
        username: "admin-skinsense",
        email: "admin@admin.com",
        password: hashedPassword,
        role: "admin",
        inOnBoard: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
