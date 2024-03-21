"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",

        onDelete: "CASCADE",
      });
      this.belongsTo(models.Report, {
        as: "report",

        foreignKey: "reportId",
        onDelete: "CASCADE",
      });
    }

    static async pressLikeReport(userId, reportId) {
      try {
        const likeReport = await this.create({
          userId: userId,
          reportId: reportId,
        });
        const likeReports = await this.findAll({
          reportId: reportId,
        });
        return {
          likeReportNum: likeReports.length,
        };
      } catch (err) {
        throw err;
      }
    }

    static async pressUnLikeReport(userId, reportId) {
      try {
        const unLikeReport = await this.destroy({
          userId: userId,
          reportId: reportId,
        });
        const likeReports = await this.findAll({
          reportId: reportId,
        });
        return {
          likeReportNum: likeReports.length,
        };
      } catch (err) {
        throw err;
      }
    }
  }

  Like.init(
    {
      userId: DataTypes.INTEGER,
      reportId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
