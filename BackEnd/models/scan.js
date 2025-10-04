"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Scan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Scan belongsTo User
      Scan.belongsTo(models.User, { foreignKey: "userId" });

      // Scan bisa punya banyak ingredients & products (nanti dari relasi pivot)
      // Scan.hasMany(models.IngredientProduct, { foreignKey: "scanId" });
      // Scan.hasMany(models.Product, { foreignKey: "scanId" });
    }
  }
  Scan.init(
    {
      userId: DataTypes.INTEGER,
      imagePath: DataTypes.STRING,
      skinType: DataTypes.STRING,
      severity: DataTypes.STRING,
      acneCount: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Scan",
    }
  );
  return Scan;
};
