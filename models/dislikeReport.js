"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DislikeReport extends Model {
    static associate(models) {
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
    static async pressHateReport(userId, reportId) {
      try {
        const hateReport = await this.create({
          userId: userId,
          reportId: reportId,
        });
        const hateReports = await this.findAll({
          reportId: reportId,
        });
        return {
          hateReportNum: hateReports.length,
        };
      } catch (err) {
        throw err;
      }
    }

    static async pressUnhateReport(userId, reportId) {
      try {
        const unHateReport = await this.destroy({
          userId: userId,
          reportId: reportId,
        });
        const hateReports = await this.findAll({
          reportId: reportId,
        });
        return {
          hateReportNum: hateReports.length,
        };
      } catch (err) {
        throw err;
      }
    }
  }

  DislikeReport.init({},
    {
      sequelize,
      modelName: "DislikeReport",
    }
  );
  return DislikeReport;
};
