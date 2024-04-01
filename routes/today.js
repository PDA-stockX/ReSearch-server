const express = require("express");
const router = express.Router();

const models = require("../models/index");
const {redis} = require("../redis/redis");

router.get("/anals", async (req, res, next) => {
    try {
        const analystIds = await redis.get("todayAnalystIds");
        const analysts = models.Analyst.findAll({
            where: {id: analystIds},
        });

        res.json(analysts);
    } catch (err) {
        console.error(err);
    }
});

router.get("/reports", async (req, res, next) => {
    try {
        const reportArr = [1, 5, 7, 3];
        const response = await models.Report.findAll({
            include: {model: models.Firm, as: "firm"},
            where: {id: reportArr},
        });

        const resList = [];
        response.forEach((el) => {
            resList.push({
                id: el.dataValues.id,
                stockName: el.dataValues.stockName,
                title: el.dataValues.title,
                firm: el.dataValues.firm.dataValues.name,
                postedAt: el.dataValues.postedAt,
            });
        });
        res.json(resList);
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
