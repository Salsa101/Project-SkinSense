"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResultScanProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ResultScanProduct.belongsTo(models.ResultScan, {
        foreignKey: "resultScan_id",
      });
      ResultScanProduct.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  ResultScanProduct.init(
    {
      resultScan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ResultScanProduct",
    }
  );
  return ResultScanProduct;
};
