const express = require("express");
const router = express.Router();
const { initModels } = require("../models/initModels");

const models = initModels();

router.get("/checkReport/:analId", async (req, res, next) => {
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

router.get("/getAnalystByFirm/:firmId", async (req, res, next) => {
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

module.exports = router;
