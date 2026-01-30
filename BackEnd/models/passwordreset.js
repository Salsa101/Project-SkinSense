"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PasswordReset.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  PasswordReset.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "PasswordReset",
    }
  );
  return PasswordReset;
};
