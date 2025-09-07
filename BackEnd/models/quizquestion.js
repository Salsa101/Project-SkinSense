'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizQuestion extends Model {
    static associate(models) {
      // Satu pertanyaan bisa punya banyak opsi
      QuizQuestion.hasMany(models.QuizOption, { foreignKey: 'quizQuestionId', as: 'quizOptions' });
    }
  }
  
  QuizQuestion.init(
    {
      quizQuestion: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT }
    },
    {
      sequelize,
      modelName: 'QuizQuestion',
    }
  );
  
  return QuizQuestion;
};
