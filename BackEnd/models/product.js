"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.RoutineProduct, {
        foreignKey: "productId",
        onDelete: "CASCADE",
        as: "RoutineProducts",
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
        defaultValue: false,
      },
      shelf_life_months: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  Product.beforeCreate((product) => {
    const shelfLifeDefaults = {
      cleanser: 12,
      sunscreen: 12,
      toner: 12,
      serum: 6,
      moisturizer: 12,
      mask: 3,
    };

    if (!product.shelf_life_months) {
      product.shelf_life_months = shelfLifeDefaults[product.productType] || 6;
    }
  });

  return Product;
};
