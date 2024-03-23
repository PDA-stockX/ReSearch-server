const express = require("express");
const router = express.Router();
const { initModels } = require("../models/initModels");
const sequelize = require("sequelize");
const models = initModels();

// 업종명 조회 : /reportSector
router.get('/', async (req, res, next) => {
    try {
        const sector = await models.ReportSector.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('sectorName')), 'sectorName'],
            ]
        });
        res.json(sector);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "fail"});
        next(err);
    }
});


module.exports = router;