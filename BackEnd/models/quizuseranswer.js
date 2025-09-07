"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QuizUserAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      QuizUserAnswer.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      QuizUserAnswer.belongsTo(models.QuizQuestion, {
        foreignKey: "quizQuestionId",
        as: "quizQuestion",
      });
      QuizUserAnswer.belongsTo(models.QuizOption, {
        foreignKey: "quizOptionId",
        as: "quizOption",
      });
    }
  }
  QuizUserAnswer.init(
    {
      userId: DataTypes.INTEGER,
      quizQuestionId: DataTypes.INTEGER,
      quizOptionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "QuizUserAnswer",
    }
  );
  return QuizUserAnswer;
};
