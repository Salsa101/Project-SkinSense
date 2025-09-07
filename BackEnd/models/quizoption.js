'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      QuizOption.belongsTo(models.QuizQuestion, { foreignKey: 'quizQuestionId', as: 'quizQuestion' });
    }
  }
  QuizOption.init({
    quizQuestionId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'QuizOption',
  });
  return QuizOption;
};