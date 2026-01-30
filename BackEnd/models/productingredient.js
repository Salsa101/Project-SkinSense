"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductIngredient.belongsTo(models.Product, { foreignKey: "product_id" });
      ProductIngredient.belongsTo(models.Ingredient, {
        foreignKey: "ingredients_id",
      });
    }
  }
  ProductIngredient.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ingredients_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProductIngredient",
    }
  );
  return ProductIngredient;
};
