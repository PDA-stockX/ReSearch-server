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

// 리포트 생성 (현재 시점으로부터 1년 이전 데이터만 수익률/달성점수 계산)
router.post("/", async (req, res, next) => {
  try {
    const reportReq = req.body.report;
    const analystReq = req.body.analyst;
    const reportSectorReq = req.body.reportSector;

    if (
      new Date(reportReq.postedAt) <=
      new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    ) {
      console.log("test");
      reportReq.returnRate = await calculateReturnRate(
        reportReq.ticker,
        reportReq.postedAt,
        reportReq.refPrice
      );
      reportReq.achievementScore = await calculateAchievementScore(
        reportReq.ticker,
        reportReq.postedAt,
        reportReq.refPrice,
        reportReq.targetPrice
      );
    }
    const report = await models.Report.create({
      ...reportReq,
      stockName: reportReq.stock,
    });

    const firm = await models.Firm.findOne({
      where: {
        name: analystReq.firm,
      },
      attributes: ["id"],
    });
    let analyst = await models.Analyst.findOne({
      where: {
        name: analystReq.name,
        email: analystReq.email,
      },
      attributes: ["id"],
    });
    if (!analyst) {
      analyst = await models.Analyst.create({
        ...analystReq,
        firmId: firm.id,
      });
    }

    await models.Report.associations.analyst.set(report, analyst);
    await models.Report.associations.firm.set(report, firm);

    await models.ReportSector.create({
      reportId: report.id,
      sectorName: reportSectorReq.sectorName,
    });

    res.status(201).json(report);
  } catch (err) {
    console.log(req.body);
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }
  const report = await models.Report.create(req.body);
  res.status(201).json(report);
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
      include: [
        {
          model: models.Analyst,
          as: "analyst",
          attributes: ["name"],
        },
        {
          model: models.Firm,
          as: "firm",
          attributes: ["name"],
        },
      ],
      order: [
        ["achievementScore", "DESC"],
        ["returnRate", "DESC"],
      ],
      limit: 10,
    });
    console.log(reports[0].analyst);
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }

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
