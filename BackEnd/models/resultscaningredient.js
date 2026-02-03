"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResultScanIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ResultScanIngredient.belongsTo(models.ResultScan, {
        foreignKey: "resultScan_id",
      });
      ResultScanIngredient.belongsTo(models.Ingredient, {
        foreignKey: "ingredients_id",
      });
    }
  }
  ResultScanIngredient.init(
    {
      resultScan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ingredients_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ResultScanIngredient",
    }
  );
  return ResultScanIngredient;
};
