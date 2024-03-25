"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Firm extends Model {
    static associate(models) {
      this.hasMany(models.Report, {
        as: "reports",
        foreignKey: "firmId",
        onDelete: "CASCADE",
      });
      this.hasMany(models.LikeFirm, {
        as: "likes",
        foreignKey: "firmId",
        onDelete: "CASCADE",
      });
      this.hasMany(models.DislikeFirm, {
        as: "dislikes",
        foreignKey: "firmId",
        onDelete: "CASCADE",
      });
      this.hasMany(models.Analyst, {
        as: "analysts",
        foreignKey: "firmId",
        onDelete: "CASCADE",
      });
    }
  }

  Firm.init(
    {
      name: DataTypes.STRING,
      returnRate: DataTypes.FLOAT,
      achievementScore: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Firm",
    }
  );
  return Firm;
};
