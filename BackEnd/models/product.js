"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.RoutineProduct, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
      Product.belongsTo(models.User, { foreignKey: "userId", as: "user" });
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
      productImage: {
        type: DataTypes.STRING,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // admin yang set true
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
