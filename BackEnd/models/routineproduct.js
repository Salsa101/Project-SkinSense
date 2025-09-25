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
        type: DataTypes.JSONB,
        allowNull: true,
      },
      customDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      productStep: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOpened: {
        type: DataTypes.DATEONLY,
      },
      expirationDate: {
        type: DataTypes.DATEONLY,
      },
      doneDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      doneStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isOpened: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "RoutineProduct",
    }
  );

  return RoutineProduct;
};
