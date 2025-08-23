"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoutineProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoutineProduct.belongsTo(models.Product, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
    }
  }
  RoutineProduct.init(
    {
      category: {
        type: DataTypes.ENUM("daily", "weekly", "custom"),
        allowNull: false,
      },
      routineName: {
        // morning atau night
        type: DataTypes.ENUM("morning", "night"),
        allowNull: false,
      },
      reminderTime: {
        type: DataTypes.TIME,
      },
      notificationFrequency: {
        type: DataTypes.STRING,
      },
      dayOfWeek: {
        // khusus weekly
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
