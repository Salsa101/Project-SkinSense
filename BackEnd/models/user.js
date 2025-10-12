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
        as: "products",
      });
      User.hasMany(models.ResultScan, {
        foreignKey: "userId",
        as: "resultScans",
      });
      User.belongsToMany(models.News, {
        through: models.Bookmark,
        foreignKey: "userId",
        otherKey: "newsId",
      });
      User.hasMany(models.Journal, { foreignKey: "userId" });
      User.hasMany(models.ReminderTime, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      full_name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      date_of_birth: DataTypes.DATEONLY,
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bannerImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      enabledNotif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
