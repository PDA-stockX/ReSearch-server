const express = require('express');
const router = express.Router();
const { initModels } = require('../models/initModels');
const { Op } = require("sequelize");

const models = initModels();

// 증권사 조회 (by search keyword)
router.get('/search', async (req, res, next) => {
    try {
        const firms = await models.Firm.findAll({
            where: {
                name: {
                    [Op.like]: `%${req.query.keyword}%`
                }
            }
        });
        res.json(firms);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "fail" });
        next(err);
    }
});

async function getFirmRankings(orderBy, res) {
    try {
        // Firm 테이블에서 name, returnRate, achievementScore 가져오기
        const FirmData = await models.Firm.findAll({
            attributes: ["id", "name", "returnRate", "achievementScore"]
        });
        // res.send(FirmData);

        // Firm 기준으로 정렬
        const sortedFirmRankings = sectorData.sort(
            (a, b) => b[orderBy] - a[orderBy]
        );

        res.json(sortedFirmRankings);
    } catch (err) {
        console.error(`Error retrieving Firm data (${orderBy}):`, err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = router;