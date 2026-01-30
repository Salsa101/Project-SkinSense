"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ingredient.belongsToMany(models.Product, {
        through: models.ProductIngredient,
        foreignKey: "ingredients_id",
        otherKey: "product_id",
      });

      // Relasi ke ResultScan via ResultScanIngredients
      Ingredient.belongsToMany(models.ResultScan, {
        through: models.ResultScanIngredient,
        foreignKey: "ingredients_id",
        otherKey: "resultScan_id",
      });
    }
  }
  Ingredient.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isSensitive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isOily: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      skinTypes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      isPregnancySafe: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Ingredient",
    }
  );
  return Ingredient;
};
