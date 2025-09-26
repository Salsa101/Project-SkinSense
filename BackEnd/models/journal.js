"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Journal.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Journal.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      journal_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mood: {
        type: DataTypes.ENUM("angry", "sad", "neutral", "happy", "excited"),
        allowNull: false,
      },
      journal_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Journal",
    }
  );
  return Journal;
};
