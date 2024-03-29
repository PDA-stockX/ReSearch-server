const {initModels} = require('../models/initModels');
const {fetchTodayReports} = require('../api/crawlApi');
const {calculateReturnRate, calculateAchievementScore} = require('./reports');
const {sendMail} = require('./mail');
const schedule = require("node-schedule");
const fs = require("fs");

const models = initModels();
const mockData = {
    analysts: null,
    follows: null,
    reports: null
}

// 오늘 리포트 저장
const saveTodayReports = async () => {
    try {
        const reports = await fetchTodayReports();
        return await models.Report.bulkCreate(reports);
    } catch (err) {
        console.error(err);
    }
}

// schedule test에 사용할 mock report 데이터 삽입
const insertMockData = async () => {
    const fs = require('fs');
    try {
        const mockAnalysts = fs.readFileSync('../task/data/MOCK_ANALYST.json');
        const parsedMockAnalysts = JSON.parse(mockAnalysts);

        const mockFollows = fs.readFileSync('../task/data/MOCK_FOLLOW.json');
        const parsedMockFollows = JSON.parse(mockFollows);

        const mockReports = fs.readFileSync('../task/data/MOCK_REPORT.json');
        const parsedMockReports = JSON.parse(mockReports);

        mockData.analysts = await models.Analyst.bulkCreate(parsedMockAnalysts);
        mockData.follows = await models.Follow.bulkCreate(parsedMockFollows);
        mockData.reports = await models.Report.bulkCreate(parsedMockReports);
        return mockData.reports;
    } catch (err) {
        console.error(err);
    }
}

const rollbackMockData = async () => {
    try {
        await models.Report.destroy({
            where: {
                id: mockData.reports.map(report => report.id)
            }
        });

        await models.Follow.destroy({
            where: {
                id: mockData.follows.map(follow => follow.id)
            }
        });

        await models.Analyst.destroy({
            where: {
                id: mockData.analysts.map(analyst => analyst.id)
            }
        });
    } catch (err) {
        console.error(err);
    }
}

// 리포트 업데이트 (수익률/달성률 계산)
const updateReport = async () => {
    try {
        const reports = await models.Report.findAll({
            where: {
                returnRate: null
            },
            order: [['postedAt', 'ASC']]
        });

        const toUpdate = reports.filter(report => report.postedAt <= reports[0].postedAt);
        for (const report of toUpdate) {
            report.returnRate = await calculateReturnRate(report.stockName, report.postedAt, report.refPrice);
            report.achievementScore = await calculateAchievementScore(report.stockName, report.postedAt,
                report.refPrice, report.targetPrice);
        }
        await models.Report.bulkCreate(toUpdate, {
            updateOnDuplicate: ['id']
        });
    } catch (err) {
        console.error(err);
    }
}

const notifyUsersOfNewReports = async () => {
  try {
    await updateReport(); // 리포트 업데이트
    await updateAnalyst(); // 애널리스트 업데이트
    const todayReports = await saveTodayReports(); // 오늘 새로 나온 리포트 저장

        const analysts = todayReports.map(report => report.analystId);
        const follows = await models.Follow.findAll({
            where: {
                analystId: analysts
            },
        });

        const userWithAnalysts = follows.reduce((acc, follow) => {
            if (!acc[follow.userId]) {
                acc[follow.userId] = [];
            }
            acc[follow.userId].push(follow.analystId);
            return acc;
        }, {});

        // 사용자에게 알림
        for (const userId in userWithAnalysts) {
            const user = await models.User.findByPk(userId);
            const analysts = userWithAnalysts[userId];
            sendMail(user, analysts);
        }
    } catch (err) {
        console.error(err);
    }
}

const setSchedule = (fn) => {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 10;
    rule.minute = 0;

    return schedule.scheduleJob(rule, function () {
        fn();
    });
}

module.exports = {notifyUsersOfNewReports, setSchedule};