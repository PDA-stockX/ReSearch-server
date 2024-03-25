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
router.post('/', async (req, res, next) => {
    // todo: 애널리스트가 존재하지 않는 경우 새로운 애널리스트로 등록
    try {
        let report = req.body.report;
        let analyst = req.body.analyst;
        let reportSector = req.body.reportSector;

        if (report.postedAt <= new Date(new Date().setFullYear(new Date().getFullYear() - 1))) {
            report.returnRate = await calculateReturnRate(report.stockName, report.postedAt, report.refPrice);
            report.achievementScore = await calculateAchievementScore(report.stockName, report.postedAt,
                report.refPrice, report.targetPrice);
        }
        report = await models.Report.create({
            ...report,
            stockName: report.stock
        });

        const firm = await models.Firm.findOne({
            where: {
                name: analyst.firm
            },
            attributes: ['id']
        });
        analyst = await models.Analyst.findOne({
            where: {
                name: analyst.name,
                email: analyst.email
            },
            attributes: ['id']
        });
        if (!analyst) {
            analyst = await models.Analyst.create({
                ...analyst,
                firmId: firm.id
            });
        }

        await models.Report.associations.analyst.set(report, analyst);
        await models.Report.associations.firm.set(report, firm);

        await models.ReportSector.create({
            reportId: report.id,
            sectorName: reportSector.sectorName
        });

        res.status(201).json(report);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "fail"});
        next(err);
    }
});

// 리포트 조회 (by search keyword)
router.get('/search', async (req, res, next) => {
    try {
        const reportSectors = await models.ReportSector.findAll({
            where: {
                sectorName: req.query.keyword
            },
        });
        if (reportSectors.length === 0) {
            res.json([]);
            return;
        }

        const reports = await models.Report.findAll({
            where: {
                id: reportSectors.map(reportSector => reportSector.reportId)
            },
            include: {
                model: models.Analyst,
                as: 'analyst',
                attributes: ['name']
            },
            limit: 3
        });
        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "fail"});
        next(err);
    }
});

module.exports = router;