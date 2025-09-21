"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // News.belongsTo(models.Category, { foreignKey: "categoryId" });

      News.belongsToMany(models.User, {
        through: models.Bookmark,
        foreignKey: "newsId",
        otherKey: "userId",
      });

      News.belongsToMany(models.Category, {
        through: {
          model: "NewsCategories",
          unique: false, // optional
        },
        foreignKey: "newsId",
        otherKey: "categoryId",
        timestamps: true,
      });
    }
  }
  News.init(
    {
      title: DataTypes.STRING,
      newsImage: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "News",
    }
  );
  return News;
};
