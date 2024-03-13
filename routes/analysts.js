const express = require('express');
const router = express.Router();

const {initModels} = require('../models/initModels');
const {Op} = require("sequelize");
const models = initModels();

// 애널리스트 총 수익률, 총 달성률 추가 :
async function updateAnalystRates() {
    try {
        // Analyst 테이블의 모든 레코드 가져오기
        const analysts = await models.Analyst.findAll();

        // Analyst 별로 업데이트 수행
        for (const analyst of analysts) {
            // Analyst의 id에 해당하는 Report 데이터 가져오기
            const reports = await models.Report.findAll({
                where: {
                    analystId: analyst.id,
                },
                include: {
                    model: models.ReportSector,
                    attributes: ['sectorId'],
                    include: {
                        model: models.Sector,
                        attributes: ['name'],
                    },
                }
            });

            // Report 데이터에서 returnRate와 achievementScore 합산
            const totalReturnRate = reports.reduce((sum, report) => sum + report.returnRate, 0);
            const totalAchievementScore = reports.reduce((sum, report) => sum + report.achievementScore, 0);

            // returnRate와 achievementScore의 평균값 계산
            const averageReturnRate = reports.length > 0 ? totalReturnRate / reports.length : 0;
            const averageAchievementScore = reports.length > 0 ? totalAchievementScore / reports.length : 0;

            // // Analyst가 쓴 리포트의 업종명을 배열로 저장
            // const sectorNames = Array.from(new Set(reports.flatMap(report => report.ReportSectors.map(rs => rs.Sector.name))));

            // Analyst 데이터 업데이트
            await models.Analyst.update(
                {
                    returnRate: averageReturnRate,
                    achievementRate: averageAchievementScore,
                },
                {
                    where: { id: analyst.id },
                }
            );
        }

        console.log('Analyst rates calculation and update successful.');
    } catch (error) {
        console.error('Error updating analyst rates:', error);
    }
}


// 애널리스트 수익률 순위 조회 : /api/analysts/earning-rate
router.get('/earning-rate', async (req, res, next) => {

    try {
        // 오늘 날짜
        const today = new Date();

        // updateAnalystRates 함수 호출
        await updateAnalystRates();

        // Analyst 테이블에서 name, firm, returnRate, achievementRate 가져오기
        const analystData = await models.Analyst.findAll({
            attributes: ['id', 'name', 'firm', 'returnRate'],
        });

        // Analyst 별 업종명 배열 가져오기
        const analystSectors = await models.Report.findAll({
            attributes: ['analystId'],
            include: {
                model: models.ReportSector,
                attributes: [],
                include: {
                    model: models.Sector,
                    attributes: ['name'],
                },
            },
            raw: true,
            nest: true,
        });

        const analystSectorMap = {};
        analystSectors.forEach((report) => {
            const analystId = report.analystId;
            if (!analystSectorMap[analystId]) {
                analystSectorMap[analystId] = [];
            }
            
            analystSectorMap[analystId].push(
                ...Array.from(new Set(report.ReportSectors.map((rs) => rs.Sector.name)))
            );
        });

        Object.keys(analystSectorMap).forEach((analystId) => {
            analystSectorMap[analystId] = Array.from(new Set(analystSectorMap[analystId]));
        });

        // Analyst에 대한 정보 정렬하기
        const sortedAnalystData = analystData.map((analyst) => ({
            id: analyst.id,
            name: analyst.name,
            firm: analyst.firm,
            returnRate: analyst.returnRate,
            sectorNames: analystSectorMap[analyst.id] || [],
        }));

        // Analyst returnRate로 내림차순 정렬해서 return
        const sortedAnalystRankings = sortedAnalystData.sort((a, b) => b.returnRate - a.returnRate);

        res.json(sortedAnalystRankings);
        
    } catch (err) {
        console.error('Error retrieving analyst data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// 애널리스트 달성률 순위 조회 : /api/analysts/achievement-rate
router.get('/achievement-rate', async (req, res, next) => {

    try {
        // 오늘 날짜
        const today = new Date();

        // updateAnalystRates 함수 호출
        await updateAnalystRates();

        // Analyst 테이블에서 name, firm, achievementRate 가져오기
        const analystData = await models.Analyst.findAll({
            attributes: ['id', 'name', 'firm', 'achievementRate'],
        });

        // Analyst 별 업종명 배열 가져오기
        const analystSectors = await models.Report.findAll({
            attributes: ['analystId'],
            include: {
                model: models.ReportSector,
                attributes: [],
                include: {
                    model: models.Sector,
                    attributes: ['name'],
                },
            },
            raw: true,
            nest: true,
        });

        const analystSectorMap = {};
        analystSectors.forEach((report) => {
            const analystId = report.analystId;
            if (!analystSectorMap[analystId]) {
                analystSectorMap[analystId] = [];
            }
            
            analystSectorMap[analystId].push(
                ...Array.from(new Set(report.ReportSectors.map((rs) => rs.Sector.name)))
            );
        });

        Object.keys(analystSectorMap).forEach((analystId) => {
            analystSectorMap[analystId] = Array.from(new Set(analystSectorMap[analystId]));
        });

        // Analyst에 대한 정보 정렬하기
        const sortedAnalystData = analystData.map((analyst) => ({
            id: analyst.id,
            name: analyst.name,
            firm: analyst.firm,
            achievementRate: analyst.achievementRate,
            sectorNames: analystSectorMap[analyst.id] || [],
        }));

        // Analyst returnRate로 내림차순 정렬해서 return
        const sortedAnalystRankings = sortedAnalystData.sort((a, b) => b.returnRate - a.returnRate);

        res.json(sortedAnalystRankings);
        
    } catch (err) {
        console.error('Error retrieving analyst data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// 업종별 애널리스트 순위 조회 : /api/analysts?sector={업종명}



// 애널리스트 즐겨찾기 순위 조회 : /api/analysts/follower-rank




module.exports = router;