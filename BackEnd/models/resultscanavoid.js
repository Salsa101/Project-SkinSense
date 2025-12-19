"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResultScanAvoid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ResultScanAvoid.belongsTo(models.ResultScan, {
        foreignKey: "resultScan_id",
        as: "resultScan",
      });
    }
  }
  ResultScanAvoid.init(
    {
      resultScan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ResultScanAvoid",
    }
  );
  return ResultScanAvoid;
};
