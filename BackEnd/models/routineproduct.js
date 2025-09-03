"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RoutineProduct extends Model {
    static associate(models) {
      RoutineProduct.belongsTo(models.Product, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
      RoutineProduct.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  RoutineProduct.init(
    {
      routineType: {
        type: DataTypes.ENUM("daily", "weekly", "custom"),
        allowNull: false,
      },
      timeOfDay: {
        type: DataTypes.ENUM("morning", "night"),
        allowNull: false,
      },
      reminderTime: {
        type: DataTypes.TIME,
      },
      notificationFrequency: {
        type: DataTypes.STRING, // contoh: "every 2 days"
      },
      dayOfWeek: {
        type: DataTypes.ENUM(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ),
        allowNull: true,
      },
      customDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "RoutineProduct",
    }
  );

  return RoutineProduct;
};
