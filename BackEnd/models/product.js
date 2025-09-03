"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.RoutineProduct, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
      Product.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  Product.init(
    {
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productBrand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productStep: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productType: {
        type: DataTypes.ENUM(
          "cleanser",
          "sunscreen",
          "toner",
          "serum",
          "moisturizer",
          "mask"
        ),
        allowNull: false,
      },
      dateOpened: {
        type: DataTypes.DATEONLY,
      },
      expirationDate: {
        type: DataTypes.DATEONLY,
      },
      productImage: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
