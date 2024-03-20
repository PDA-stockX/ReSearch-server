const express = require("express");
const router = express.Router();
const { initModels } = require("../models/initModels");
const {Op} = require("sequelize");
const models = initModels();


router.get('/return-rate', async (req, res, next) => {
    console.log("req");
    // const respon = await getAnalystRankings('returnRate', res);
    const analInfo = await models.Analyst.findOne({
        where: { id: 1 },
      });
      console.log(analInfo);
});

// 애널리스트 조회 (by search keyword)
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


// 애널리스트 총 수익률, 달성률 계산 및 업데이트
async function updateAnalystRates() {
    try {
        console.log("dkdkdkdkdkdk")
        // Analyst 테이블의 모든 레코드 가져오기
        const analysts = await models.Analyst.findOne({});
        console.log("아아아아아아아아아" + analysts);
        // Analyst 별로 업데이트 수행
        for (const analyst of analysts) {
            // 이미 값이 있는 경우에는 계산하지 않음
            if (analyst.returnRate !== null && analyst.achievementScore !== null) {
                continue;
            }

            // Analyst의 id에 해당하는 Report 데이터 가져오기
            const reports = await models.Report.findAll({
                where: {
                    analystId: analyst.id,
                },
            });

            // Report 데이터에서 returnRate와 achievementScore 합산
            const totalReturnRate = reports.reduce((sum, report) => sum + report.returnRate, 0);
            const totalAchievementScore = reports.reduce((sum, report) => sum + report.achievementScore, 0);

            // returnRate와 achievementScore의 평균값 계산
            const averageReturnRate = reports.length > 0 ? totalReturnRate / reports.length : 0;
            const averageAchievementScore = reports.length > 0 ? totalAchievementScore / reports.length : 0;
            // console.log("아아아아ㅏ아아" + averageReturnRate);
            // Analyst 데이터 업데이트
            const temp = await models.Analyst.update(
                {
                    returnRate: averageReturnRate,
                    achievementScore: averageAchievementScore,
                },
                {
                    where: { id: analyst.id },
                }
            );
            // console.log(temp)
        }

        console.log('Analyst rates calculation and update successful.');
        
    } catch (error) {
        console.error('Error updating analyst rates:', error);
    }
}



// 수익률 및 달성률에 대한 정렬
async function getAnalystRankings(orderBy, res) {
    try {
        console.log("FKFKFKFKKFFK")
        await updateAnalystRates();
        
        // 반환할 데이터
        const returnData = [];

        // 애널리스트 데이터를 조회하여 정렬 기준에 따라 정렬
        const analystData = await models.Analyst.findAll({
            attributes: ['id', 'firmId', 'name', 'returnRate', 'achievementScore'],
            order: [[orderBy, 'DESC']]
        });
        // console.log(analystData)
        // 각 애널리스트의 정보를 순회하며 필요한 정보 수집
        for (const analyst of analystData) {
            // 소속 회사 정보 조회
            const firm = await models.Firm.findOne({
                where: {
                    id: analyst.firmId
                },
                attributes: ['name']
            });

            // 업종명 조회
            const reports = await models.Report.findAll({
                where: {
                    analystId: analyst.id
                },
                include: [{
                    model: models.ReportSector,
                    attributes: ['sectorName']
                }]
            })

            // 반환할 데이터 배열에 저장
            returnData.push({
                id: analyst.id,
                name: analyst.name,
                returnRate: analyst.returnRate,
                achievementScore: analyst.achievementScore,
                firm: firm ? firm : null, //firm.name : null,
                sectors: reports.flatMap(report => report.ReportSectors.map(sector => sector.sectorName))
            })
        }

        return returnData

    } catch (err) {
        console.error(`Error retrieving analyst data (${orderBy}):`, err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}




// 애널리스트 수익률 순위 조회 : /analyst/return-rate


module.exports = router;
