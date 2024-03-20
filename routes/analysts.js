const express = require('express');
const router = express.Router();
const {initModels} = require('../models/initModels');
const {Op} = require("sequelize");

const models = initModels();

// 애널리스트 조회 (by search keyword)
router.get('/search', async (req, res, next) => {
    try {
        const analysts = await models.Analyst.findAll({
            where: {
                name: {
                    [Op.like]: `%${req.query.keyword}%`
                }
            }
        });
        res.json(analysts);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: "fail"});
        next(err);
    }
});

module.exports = router;
