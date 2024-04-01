const {calculateReturnRate, calculateAchievementScore} = require('./reports');
const {sendMail} = require('./mail');
const models = require('../models/index');
const {redis} = require('../redis/redis');
const schedule = require("node-schedule");
const {startOfDay, endOfDay} = require("../utils/dateUtil");
const {Op} = require("sequelize");

/**
 * 리포트 업데이트 (수익률/달성점수 계산)
 * @returns {Promise<void>}
 */
async function updateReports() {
    try {
        const reports = await models.Report.findAll({
            where: {
                returnRate: null
            },
            order: [['postedAt', 'ASC']]
        });

        const toUpdate = reports.filter(report => report.postedAt <= reports[0].postedAt);
        for (const report of toUpdate) {
            report.returnRate = await calculateReturnRate(
                report.stockName,
                report.postedAt,
                report.refPrice);
            report.achievementScore = await calculateAchievementScore(
                report.stockName,
                report.postedAt,
                report.refPrice,
                report.targetPrice);
        }
        await models.Report.bulkCreate(toUpdate, {
            updateOnDuplicate: ['id']
        });
    } catch (err) {
        console.error(err);
    }
}

/**
 * 애널리스트 업데이트 (수익률/달성점수 계산)
 * @returns {Promise<void>}
 */
async function updateAnalysts() {
    try {
        const analysts = await models.Analyst.findAll();

        for (const analyst of analysts) {
            const reports = await models.Report.findAll({
                where: {
                    analystId: analyst.id,
                },
                attributes: ["returnRate", "achievementScore"],
            });

            const {averageReturnRate, averageAchievementScore} = calculateEvaluation(reports);

            analyst.returnRate = averageReturnRate;
            analyst.achievementScore = averageAchievementScore;
        }
        await models.Analyst.bulkCreate(analysts, {
            updateOnDuplicate: ['id']
        });
    } catch (err) {
        console.error(err);
    }
}

/**
 * 증권사 업데이트 (수익률/달성점수 계산)
 * @returns {Promise<void>}
 */
async function updateFirms() {
    try {
        const firms = await models.Firm.findAll();

        for (const firm of firms) {
            const analysts = await models.Analyst.findAll({
                where: {
                    firmId: firm.id,
                },
                attributes: ["returnRate", "achievementScore"],
            });

            const {averageReturnRate, averageAchievementScore} = calculateEvaluation(analysts);

            firm.returnRate = averageReturnRate;
            firm.achievementScore = averageAchievementScore;
        }
        await models.Firm.bulkCreate(firms, {
            updateOnDuplicate: ['id']
        });
    } catch (err) {
        console.error(err);
    }
}

/**
 * 즐겨찾기 애널리스트의 새 리포트가 등록되었을 때 사용자에게 알림
 * @returns {Promise<void>}
 */
async function notifyUsersOfNewReports() {
    try {
        const reports = await getTodayReports();

        // 리포트를 작성한 애널리스트를 팔로우하는 사용자
        const follows = await models.Follow.findAll({
            where: {
                analystId: reports.map(report => report.analystId)
            },
        });
        const userWithAnalysts = follows.reduce((acc, follow) => {
            if (!acc[follow.userId]) {
                acc[follow.userId] = new Set();
            }
            acc[follow.userId].add(follow.analystId);
            return acc;
        }, {});

        // 사용자에게 알림
        for (const userId in userWithAnalysts) {
            const user = await models.User.findByPk(userId);
            const analysts = await models.Analyst.findAll({
                where: {
                    id: Array.from(userWithAnalysts[userId])
                }
            });
            sendMail(user, analysts);
        }

    } catch (err) {
        console.error(err);
    }
}

async function updateTodayAnalysts() {
    try {
        const reports = await getTodayReports();

        const analysts = [];
        for (const report of reports) {
            const analyst = await models.Analyst.findByPk(report.analystId);
            analysts.push(analyst);
        }

        const scores = [];
        for (const analyst of analysts) {
            const countReports = await models.Report.count({
                where: {
                    analystId: analyst.id,
                }
            });

            scores.push({
                analystId: analyst.id,
                score: analyst.achievementScore * 0.5
                    + analyst.returnRate * 100 * 0.3
                    + (Math.min(countReports, 20) / 20) * 100 * 0.2
            });
        }

        scores.sort((a, b) => b.score - a.score);

        const analystIds = scores.slice(0, 3).map(score => score.analystId);
        redis.set("todayAnalystIds", JSON.stringify(analystIds));
    } catch (err) {

    }
}

async function getTodayReports() {
    return await models.Report.findAll({
        where: {
            createdAt: {
                [Op.gte]: startOfDay(new Date()),
                [Op.lte]: endOfDay(new Date())
            }
        },
    });
}

/**
 * 수익률, 달성점수 계산
 * @param obj
 * @returns {{averageReturnRate: number, averageAchievementScore: number}}
 */
function calculateEvaluation(obj) {
    const totalReturnRate = obj.reduce((sum, report) => sum + report.returnRate, 0);
    const totalAchievementScore = obj.reduce((sum, report) => sum + report.achievementScore, 0);
    const averageReturnRate = obj.length > 0 ? totalReturnRate / obj.length : null;
    const averageAchievementScore = obj.length > 0 ? totalAchievementScore / obj.length : null;
    return {averageReturnRate, averageAchievementScore};
}

/**
 * 스케줄 설정
 * @param time
 * @param callback (입력 순서대로 실행)
 * @returns {Job}
 */
function setSchedule(time, ...callback) {
    const rule = new schedule.RecurrenceRule();
    rule.hour = time.hour;
    rule.minute = time.minute;

    return schedule.scheduleJob(rule, async function () {
        try {
            for (const cb of callback) {
                await cb();
            }
        } catch (err) {
            console.error(err);
        }
    });
}

module.exports = {updateReports, updateAnalysts, updateFirms, notifyUsersOfNewReports, setSchedule};