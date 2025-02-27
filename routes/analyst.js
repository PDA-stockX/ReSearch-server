const express = require("express");
const router = express.Router();
const models = require("../models/index");

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

router.get("/checkSector/:analId", async (req, res, next) => {
  try {
    const reports = await models.Report.findAll({
      include: {
        model: models.ReportSector,
        as: "sectors",
      },
      where: {
        analystId: req.params.analId,
      },
    });
    // console.log(reports);
    const tempList = [];
    reports.forEach((el) => {
      // console.log(el);
      if (el.dataValues.sectors[0]) {
        for (temp in tempList) {
          console.log(tempList[temp]);

          if (
            tempList[temp].sectorName ==
            el.dataValues.sectors[0].dataValues.sectorName
          ) {
            tempList[temp].num++;
            return;
          }
        }
        tempList.push({
          sectorName: el.dataValues.sectors[0].dataValues.sectorName,
          num: 1,
        });
      }
    });
    tempList.sort((a, b) => {
      b.num - a.num;
    });
    res.json(tempList[0]);
    // console.log(tempList);
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
