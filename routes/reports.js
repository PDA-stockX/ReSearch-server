const express = require("express");
const router = express.Router();

const models = require("../models/index");
const {
  calculateReturnRate,
  calculateAchievementScore,
} = require("../services/reports");
const { Op } = require("sequelize");

router.get("/", async (req, res, next) => {
  try {
    const reportSectors = await models.ReportSector.findOne({
      where: {
        sectorName: req.query.sector,
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
          { achievementScore: { [Op.gte]: req.query.achievementScore } },
          { achievementScore: { [Op.lte]: req.query.achievementScore } },
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
  // todo: 연관관계 맺어주기
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

// 리포트 조회 (by search keyword)
router.get("/search", async (req, res, next) => {
  try {
    const reportSectors = await models.ReportSector.findAll({
      where: {
        sectorName: req.query.keyword,
      },
    });
    if (reportSectors.length === 0) {
      res.json([]);
      return;
    }

    const reports = await models.Report.findAll({
      where: {
        id: reportSectors.map((reportSector) => reportSector.reportId),
      },
    });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }

  console.log(reportSectors[0]);

  const reports = await models.Report.findAll({
    where: {
      id: reportSectors.map((reportSector) => reportSector.reportId),
    },
  });
  res.json(reports);
});

router.get("/:reportId", async (req, res, next) => {
  try {
    const reportDetail = await models.Report.findOne({
      include: [
        { model: models.Firm, as: "firm" },
        { model: models.Analyst, as: "analyst" },
      ],
      where: { id: req.params.reportId },
    });
    // console.log(reportDetail);
    res.json(reportDetail);
  } catch (err) {
    throw err;
  }
});

router.get("/:reportId", async (req, res, next) => {
  try {
    const reportDetail = await models.Report.findOne({
      include: [
        { model: models.Firm, as: firmName, attributes: ["name"] },
        { model: models.Analyst, as: analName, attributes: ["name"] },
      ],
      where: { id: req.params.reportId },
    });
    console.log(reportDetail);
    res.json(reportDetail);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
