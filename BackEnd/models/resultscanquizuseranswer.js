"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResultScanQuizUserAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ResultScanQuizUserAnswer.belongsTo(models.ResultScan, {
        foreignKey: "resultScanId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      ResultScanQuizUserAnswer.belongsTo(models.QuizUserAnswer, {
        foreignKey: "quizUserAnswerId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  ResultScanQuizUserAnswer.init(
    {
      resultScanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quizUserAnswerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ResultScanQuizUserAnswer",
      tableName: "ResultScanQuizUserAnswer",
      freezeTableName: true,
    }
  );
  return ResultScanQuizUserAnswer;
};
