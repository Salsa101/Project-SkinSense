"use strict";
module.exports = (sequelize, DataTypes) => {
  const NewsCategory = sequelize.define(
    "NewsCategory",
    {
      newsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );

  NewsCategory.associate = function (models) {
    // optional, biasanya association cukup di News & Category
  };

  return NewsCategory;
};
