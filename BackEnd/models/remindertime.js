"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReminderTime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReminderTime.hasMany(models.RoutineProduct, {
        foreignKey: "timeOfDay",
        sourceKey: "timeOfDay",
      });
      ReminderTime.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  ReminderTime.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timeOfDay: {
        type: DataTypes.ENUM("morning", "night"),
        allowNull: false,
        unique: true,
      },
      reminderTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "ReminderTime",
    }
  );
  return ReminderTime;
};
