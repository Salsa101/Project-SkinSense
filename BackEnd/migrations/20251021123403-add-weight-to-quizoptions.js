'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('QuizOptions', 'weight', {
      type: Sequelize.FLOAT,
      allowNull: true, // or false if you’ll always set it
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('QuizOptions', 'weight');
  }
  

 
};
