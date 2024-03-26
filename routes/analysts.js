const express = require("express");
const router = express.Router();
const { initModels } = require("../models/initModels");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const models = initModels();

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
      limit: 3,
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
      limit: 3,
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
      limit: 3,
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

// 애널리스트 총 수익률, 총 달성률 추가
// 애널리스트 정보 업데이트 : /analysts/
//TODO: <- 배치 (리포트 가져올 때 같이 수행)
router.post("/", async (req, res, next) => {
  try {
    // Analyst 테이블의 모든 레코드 가져오기
    const analysts = await models.Analyst.findAll();

    // Analyst 별로 업데이트 수행
    for (const analyst of analysts) {
      // // 이미 값이 있는 경우에는 계산하지 않음
      // if (analyst.returnRate !== null && analyst.achievementScore !== null) {
      //     continue;
      // }

      // Analyst의 id에 해당하는 Report 데이터 가져오기
      const reports = await models.Report.findAll({
        where: {
          analystId: analyst.id,
        },
        attributes: ["returnRate", "achievementScore"],
      });

      // Report 데이터에서 returnRate와 achievementScore 합산
      const totalReturnRate = reports.reduce(
        (sum, report) => sum + report.returnRate,
        0
      );
      const totalAchievementScore = reports.reduce(
        (sum, report) => sum + report.achievementScore,
        0
      );

      // returnRate와 achievementScore의 평균값 계산
      const averageReturnRate =
        reports.length > 0 ? totalReturnRate / reports.length : 0;
      const averageAchievementScore =
        reports.length > 0 ? totalAchievementScore / reports.length : 0;

      // Analyst 데이터 업데이트
      await models.Analyst.update(
        {
          returnRate: averageReturnRate,
          achievementScore: averageAchievementScore,
        },
        {
          where: { id: analyst.id },
        }
      );
      res.send("success");
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }
});

// 애널리스트 조회 (by search keyword)
router.get("/search", async (req, res, next) => {
  try {
    const analysts = await models.Analyst.findAll({
      where: {
        name: {
          [Op.like]: `%${req.query.keyword}%`,
        },
      },
    });
    res.json(analysts);
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
  } catch (err) {
    console.error("Error retirieving Return Rate", error);
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
      order: [[sequelize.literal("followerCount"), "DESC"]],
    });
    console.log("a", rankedAnalysts);

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

    // res.send(analysts);

    // 각 애널리스트별로 평균 수익률과 평균 달성률 계산
    const analystData = analysts
      .map((analyst) => {
        const filteredReports = analyst.reports.filter(
          (report) => report.returnRate !== 0 || report.achievementScore !== 0
        );
        const totalReturnRate = filteredReports.reduce(
          (sum, report) => sum + report.returnRate,
          0
        );
        const totalAchievementScore = filteredReports.reduce(
          (sum, report) => sum + report.achievementScore,
          0
        );
        const totalCount = filteredReports.length; // 필터링된 리포트 개수

        // 리포트가 없거나 모든 리포트가 returnRate와 achievementScore가 0인 경우 데이터 반환하지 않음
        if (
          totalCount === 0 ||
          (totalReturnRate === 0 && totalAchievementScore == 0)
        ) {
          return null;
        }

        const averageReturnRate = totalReturnRate / totalCount;
        const averageAchievementScore = totalAchievementScore / totalCount;

        return {
          id: analyst.id,
          name: analyst.name,
          firm: analyst.firm,
          returnRate: averageReturnRate,
          achievementScore: averageAchievementScore,
          sector: sectorName,
        };
      })
      .filter((data) => data !== null); // null이 아닌 데이터만 필터링

    // res.send(analystData);

    // 일단 수익률 기준으로 정렬 (가중치 적용하기로 함)
    const sortedAnalystRankings = analystData.sort(
      (a, b) => b.returnRate - a.returnRate
    );

    res.json(sortedAnalystRankings);
  } catch (err) {
    console.error("Error retrieving analyst data by sector:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 수익률 및 달성률에 대한 정렬 기준 //TODO: 업종명도 어디 저장해둬야 할 듯, 리포트 업데이트 할 때 새로운 업종이 있다면 추가로 저장하는 형식으로
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
          // console.log(reports);

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
