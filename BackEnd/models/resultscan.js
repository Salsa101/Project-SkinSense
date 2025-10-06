"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ResultScan extends Model {
    static associate(models) {
      // Pakai this, jangan ResultScan
      ResultScan.belongsTo(models.User, { foreignKey: "userId" });

      ResultScan.belongsToMany(models.Ingredient, {
        through: models.ResultScanIngredient,
        foreignKey: "resultScan_id",
        otherKey: "ingredients_id",
      });

      ResultScan.belongsToMany(models.Product, {
        through: models.ResultScanProduct,
        foreignKey: "resultScan_id",
        otherKey: "product_id",
      });

      ResultScan.belongsTo(models.QuizUserAnswer, {
        foreignKey: "quizId",
        as: "quiz",
      });
    }
  }

  ResultScan.init(
    {
      userId: DataTypes.INTEGER,
      quizId: DataTypes.INTEGER,
      imagePath: DataTypes.STRING,
      skinType: DataTypes.STRING,
      severity: DataTypes.STRING,
      acneCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ResultScan",
    }
  );

  return ResultScan;
};
