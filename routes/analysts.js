const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { getRankings } = require("../services/analysts");

const models = require("../models/index");

// 애널리스트 조회 (by search keyword)
router.get("/search", async (req, res, next) => {
  try {
    // 애널리스트 이름으로 검색
    const analystsByName = await models.Analyst.findAll({
      where: {
        name: {
          [Op.like]: `%${req.query.keyword}%`,
        },
      },
      order: [
        ["achievementScore", "DESC"],
        ["returnRate", "DESC"],
      ],
      limit: 10,
    });
    if (analystsByName.length > 0) {
      return res.json(analystsByName);
    }

    // 애널리스트 소속 증권사 이름으로 검색
    const firms = await models.Firm.findAll({
      where: {
        name: {
          [Op.like]: `%${req.query.keyword}%`,
        },
      },
    });
    const analystsByFirm = await models.Analyst.findAll({
      where: {
        firmId: firms.map((firm) => firm.id),
      },
      order: [
        ["achievementScore", "DESC"],
        ["returnRate", "DESC"],
      ],
      limit: 10,
    });
    if (analystsByFirm.length > 0) {
      return res.json(analystsByFirm);
    }

    // 애널리스트가 작성한 리포트의 업종명으로 검색
    const reportSectors = await models.ReportSector.findAll({
      where: {
        sectorName: req.query.keyword,
      },
    });
    const reportsGroupedByAnalyst = await models.Report.findAll({
      where: {
        id: reportSectors.map((reportSector) => reportSector.reportId),
      },
      include: {
        model: models.Analyst,
        as: "analyst",
        attributes: ["name"],
      },
      attributes: [
        "analystId",
        [sequelize.fn("COUNT", sequelize.col("analystId")), "countReports"],
      ],
      group: ["analystId"],
      order: sequelize.literal("countReports DESC"),
    });
    const analystsBySector = await models.Analyst.findAll({
      where: {
        id: reportsGroupedByAnalyst.map((report) => report.analystId),
      },
      order: [
        ["achievementScore", "DESC"],
        ["returnRate", "DESC"],
      ],
      limit: 10,
    });
    if (analystsBySector.length > 0) {
      return res.json(analystsBySector);
    }

    res.json([]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }
});

// 애널리스트 수익률 순위 조회 : /analysts/return-rate
router.get("/return-rate", (req, res, next) => {
  try {
    getAnalystRankings("returnRate", res);
  } catch (error) {
    console.error("Error retrieving Return Rate", error);
  }
});

// 애널리스트 달성률 순위 조회 : /analysts/achievement-score
router.get("/achievement-score", async (req, res, next) => {
  try {
    await getAnalystRankings("achievementScore", res);
  } catch (error) {
    console.error("Error retrieving Achievement Score", error);
  }
});

// 애널리스트 즐겨찾기 순위 조회 : /analysts/follower-rank
router.get("/follower-rank", async (req, res, next) => {
  try {
    // 팔로워 수를 기준으로 애널리스트 정렬
    const rankedAnalysts = await models.Analyst.findAll({
      attributes: [
        "id",
        "name",
        "firmId",
        [
          sequelize.fn("COUNT", sequelize.col("`follows`.userId")),
          "followerCount",
        ],
      ],
      include: [
        {
          model: models.Follow,
          as: "follows",
          attributes: [],
          // required: false
        },
        {
          model: models.Firm,
          as: "firm",
          attributes: ["name"],
        },
      ],
      group: ["Analyst.id"],
      order: [
        [sequelize.literal("followerCount"), "DESC"],
        ["name", "ASC"],
      ],
    });

    res.json(rankedAnalysts);
  } catch (err) {
    console.error("Error retrieving analyst follower rankings:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 업종별 애널리스트 순위 조회 : /analysts?sector={업종명}
router.get("/", async (req, res, next) => {
  try {
    // 받은 업종명
    const sectorName = req.query.sector;
    const scores = []; // 평가 점수 저장할 배열
    if (!sectorName) {
      return res.status(400).json({ message: "업종명을 제공해야 합니다." });
    }
    // 특정 업종에 속한 애널리스트들의 리포트 가져오기
    const analysts = await models.Analyst.findAll({
      include: [
        {
          model: models.Report,
          as: "reports",
          include: {
            model: models.ReportSector,
            as: "sectors",
            where: {
              sectorName: sectorName,
            },
            attributes: [],
          },
        },
        {
          model: models.Firm,
          as: "firm",
          attributes: ["name"],
        },
      ],
      attributes: ["id", "name"],
    });

    // 각 애널리스트별로 평가점수 계산
    const analystData = analysts.map((analyst) => {
      const filteredReports = analyst.reports.filter(Boolean);

      // 리포트가 없는 경우
      if (!filteredReports.length) {
        return;
      }

      const totalReturnRate = filteredReports.reduce(
        (sum, report) => sum + report.returnRate,
        0
      );
      const totalAchievementScore = filteredReports.reduce(
        (sum, report) => sum + report.achievementScore,
        0
      );
      const totalCount = filteredReports.length; // 필터링된 리포트 개수

      const averageReturnRate = totalReturnRate / totalCount;
      const averageAchievementScore = totalAchievementScore / totalCount;
      const score = (
        averageReturnRate * 0.3 +
        averageAchievementScore * 0.5
      ).toFixed(2); // 평가 점수 (가중치 : 수익률 30%, 달성률 50%)

      scores.push({
        id: analyst.id,
        name: analyst.name,
        firm: analyst.firm,
        returnRate: averageReturnRate,
        achievementScore: averageAchievementScore,
        sector: sectorName,
        score: score,
      });

      return scores; //.filter((data) => data !== null);
    });

    const sortedScores = scores.sort((a, b) => b.score - a.score);

    res.json(sortedScores);
  } catch (err) {
    console.error("Error retrieving analyst data by sector:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 수익률 및 달성률에 대한 정렬 기준 //TODO: 리포트 업데이트 할 때 새로운 업종이 있다면 추가로 저장하는 형식으로
async function getAnalystRankings(orderBy, res) {
  try {
    // Analyst 테이블에서 name, firm, returnRate, achievementScore 가져오기
    const analystData = await models.Analyst.findAll({
      attributes: ["id", "name", "returnRate", "achievementScore"],
      include: {
        model: models.Firm,
        as: "firm",
        attributes: ["name"],
      },
    });
    // res.send(analystData);

    // Analyst 별 업종 정보 가져오기
    const sectorData = await Promise.all(
      analystData.map(async (analyst) => {
        try {
          // 애널리스트가 작성한 리포트들을 모두 불러옵니다.
          const reports = await models.Report.findAll({
            where: { analystId: analyst.id },
            include: {
              model: models.ReportSector,
              as: "sectors",
              attributes: ["sectorName"],
            },
          });
          // res.send(reports);

          // 리포트들에 포함된 업종명을 배열로 저장합니다.
          const sectorNames = reports.flatMap((report) =>
            report.sectors.map((rs) => rs.sectorName)
          );

          // 중복된 업종명을 제거합니다.
          const uniqueSectorNames = Array.from(new Set(sectorNames));

          return { ...analyst.toJSON(), sectorNames: uniqueSectorNames };
        } catch (err) {
          console.error(
            `Error fetching sector data for analyst ${analyst.id}:`,
            err
          );
          // 오류가 발생한 애널리스트는 제외하고 null을 반환
          return null;
        }
      })
    );

    // Analyst 기준으로 정렬
    const sortedAnalystRankings = sectorData.sort(
      (a, b) => b[orderBy] - a[orderBy]
    );

    res.json(sortedAnalystRankings);
  } catch (err) {
    console.error(`Error retrieving analyst data (${orderBy}):`, err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

router.get("/reports/:analId", async (req, res, next) => {
  try {
    const response = await models.Report.findAll({
      where: { analystId: req.params.analId },
    });
    console.log(response);
    res.json(response);
  } catch (err) {
    throw err;
  }
});

router.get("/sectors/:analId", async (req, res, next) => {
  try {
    const reports = await models.Report.findAll({
      include: {
        model: models.ReportSector,
        as: "sectors",
      },
      where: {
        analystId: req.params.analId,
      },
    });
    console.log(reports);
    const tempList = [];
    reports.forEach((el) => {
      // console.log(el);
      if (el.dataValues.sectors[0]) {
        for (temp in tempList) {
          console.log(tempList[temp]);

          if (
            tempList[temp].sectorName ==
            el.dataValues.sectors[0].dataValues.sectorName
          ) {
            tempList[temp].num++;
            return;
          }
        }
        tempList.push({
          sectorName: el.dataValues.sectors[0].dataValues.sectorName,
          num: 1,
        });
      }
    });
    tempList.sort((a, b) => {
      b.num - a.num;
    });
    res.json(tempList[0]);
    // console.log(tempList);
  } catch (err) {
    throw err;
  }
});

router.get("/anals/today", async (req, res, next) => {
  try {
    //임시 오늘 리포트 애널리스트
    const analystIdArr = [3, 59, 107];
    const response = await getRankings(analystIdArr);
    console.log(response);

    res.json(response);
  } catch (err) {
    console.error(err);
  }
});
router.get("/analysts-firm/:firmId", async (req, res, next) => {
  try {
    const response = await models.Analyst.findAll({
      where: { firmId: req.params.firmId },
    });
    const sendData = [];
    response.forEach((el) => {
      console.log(el.dataValues);
      sendData.push(el.id);
    });
    res.json(sendData);
  } catch (err) {
    throw err;
  }
});

// 애널리스트 조회 (by search keyword)
router.get("/:analId", async (req, res, next) => {
  try {
    console.log(req.params.analId);
    const analInfo = await models.Analyst.findOne({
      include: [
        {
          model: models.Firm,
          as: "firm",
          attributes: ["name"],
        },
      ],
      where: { id: req.params.analId },
    });
    console.log(analInfo);
    res.json(analInfo);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }
});

router.get("/:analId", async (req, res, next) => {
  try {
    console.log(req.params.analId);
    const analInfo = await models.Analyst.findOne({
      where: { id: req.params.analId },
    });
    console.log(analInfo);
    res.json(analInfo);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }
});

module.exports = router;
