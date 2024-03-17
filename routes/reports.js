const express = require("express");
const router = express.Router();

const { initModels } = require("../models/initModels");
const {
  calculateReturnRate,
  calculateAchievementScore,
} = require("../services/reports");
const { Op } = require("sequelize");
const models = initModels();

router.get("/search", async (req, res, next) => {
  try {
    const sector = await models.Sector.findOne({
      where: {
        name: req.query.sector,
      },
    });

    const reportSectors = await models.ReportSector.findAll({
      where: {
        sectorId: sector.id,
      },
    });

    const reportIds = reportSectors.map(
      (reportSector) => reportSector.reportId
    );

    const reports = await models.Report.findAll({
      where: {
        [Op.and]: [
          { id: reportIds },
          { returnRate: { [Op.gte]: req.query.returnRate } },
          { returnRate: { [Op.lte]: req.query.returnRate } },
          { achievementRate: { [Op.gte]: req.query.achievementRate } },
          { achievementRate: { [Op.lte]: req.query.achievementRate } },
        ],
      },
    });

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }
});

// 리포트 생성 (현재 시점으로부터 1년 이상 이전 데이터만 수익률/달성률 계산)
router.post("/", async (req, res, next) => {
  try {
    if (
      req.body.postedAt <=
      new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    ) {
      req.body.returnRate = await calculateReturnRate(
        req.body.stockName,
        req.body.postedAt,
        req.body.refPrice
      );
      req.body.achievementScore = await calculateAchievementScore(
        req.body.stockName,
        req.body.postedAt,
        req.body.refPrice,
        req.body.targetPrice
      );
    }
    const report = await models.Report.create(req.body);
    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }
});
