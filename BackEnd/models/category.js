"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Category.hasMany(models.News, { foreignKey: "categoryId" });

      Category.belongsToMany(models.News, {
        through: {
          model: "NewsCategories",
          unique: false, // optional
        },
        foreignKey: "categoryId",
        otherKey: "newsId",
        timestamps: true,
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
