"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      this.belongsTo(models.Analyst, {
        as: "analyst",
        targetKey: "analystId",
        foreignKey: "analystId",
        onDelete: "CASCADE",
      });
      this.hasMany(models.LikeReport, {
        as: "likes",
        foreignKey: "reportId",
        onDelete: "CASCADE",
      });
      this.hasMany(models.DislikeReport, {
        as: "dislikes",
        foreignKey: "reportId",
        onDelete: "CASCADE",
      });
    }
  }

  Report.init(
    {
      pdfUrl: DataTypes.STRING,
      ticker: DataTypes.STRING,
      investmentOpinion: DataTypes.STRING,
      postedAt: DataTypes.DATE,
      refPrice: DataTypes.INTEGER,
      targetPrice: DataTypes.INTEGER,
      returnRate: DataTypes.FLOAT,
      achievementScore: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Report",
    }
  );
  return Report;
};
