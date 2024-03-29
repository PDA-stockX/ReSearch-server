const express = require("express");
const router = express.Router();
const { initModels } = require("../models/initModels");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const firm = require("../models/firm");

const models = initModels();

// 증권사 조회 (by search keyword)
router.get("/search", async (req, res, next) => {
  try {
    const firms = await models.Firm.findAll({
      where: {
        name: {
          [Op.like]: `%${req.query.keyword}%`,
        },
      },
      order: [
        ["achievementScore", "DESC"],
        ["returnRate", "DESC"],
      ],
      limit: 3,
    });
    res.json(firms);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }
});

router.get("/getDetail/:firmId", async (req, res, next) => {
  try {
    console.log(req.params);
    const firms = await models.Firm.findOne({
      where: {
        id: req.params.firmId,
      },
    });
    console.log(firms);
    res.json(firms);
  } catch (err) {
    throw err;
  }
});

router.post("/", async (req, res, next) => {
  try {
    const firms = await models.Firm.findAll();

    for (const firm of firms) {
      const reports = await models.Report.findAll({
        where: {
          reportId: firm.id,
        },
        attributes: ["returnRate", "achievementScore"],
      });

      const totalReturnRate = reports.reduce((sum, report) => sum + report.returnRate, 0);
      const totalAchievementScore = reports.reduce((sum, report) => sum + report.achievementScore, 0);

      const averageReturnRate = reports.length > 0 ? totalReturnRate / reports.length : 0;
      const averageAchievementScore = reports.length > 0 ? totalAchievementScore / reports.length : 0;

      await models.Firm.update(
        {
          returnRate: averageReturnRate,
          achievementScore: averageAchievementScore,
        },
        {
          where: { id: firm.id },
        }
      );
      res.send("firm updated")
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "firm update fail" });
    next(err);
  }
})

router.get("/return-rate", async (req, res, next) => {
  try {
    const firmData = await models.Firm.findAll({
      attributes: ["id", "name", "returnRate"],
    });

    const result = firmData.sort((a, b) => b["returnRate"] - a["returnRate"]);
    res.json(result)
  } catch (error) {
    console.error("Error retrieving Return Rate", error);
  }
});

router.get("/achievement-score", async (req, res, next) => {
  try {
    const firmData = await models.Firm.findAll({
      attributes: ["id", "name", "achievementScore"],
    });

    const result = firmData.sort((a, b) => b["achievementScore"] - a["achievementScore"]);
    res.json(result)
  } catch (error) {
    console.error("Error retrieving Achievement Score", error);
  }
});

router.get("/like-rank", async (req, res, next) => {
  try {
    const result = await models.Firm.findAll({
      attributes: ["id", "name",
        [sequelize.fn("COUNT", sequelize.col("`likes`.userId")), "likeCount"],
      ],
      include: [
        {
          model: models.LikeFirm,
          as: "likes",
          attributes: [],
        },
      ],
      group: ["Firm.id"],
      order: [[sequelize.literal("likeCount"), "DESC"]]
    });
    res.json(result)
  } catch (err) {
    console.error("Error retrieving firm like rankings:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

module.exports = router;
