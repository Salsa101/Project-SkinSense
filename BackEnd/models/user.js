"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Product, {
        foreignKey: "userId",
        as: "products", // nama alias supaya mudah di include
      });
      User.belongsToMany(models.News, {
        through: models.Bookmark,
        foreignKey: "userId",
        otherKey: "newsId",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      full_name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      date_of_birth: DataTypes.DATEONLY,
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
