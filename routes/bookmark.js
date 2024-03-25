var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken, authenticate } = require("../services/auth");

router.use(authenticate);

router.get("/myAnal", async function (req, res, next) {
  console.log(req.header);
  try {
    const myAnalList = await models.Follow.findAll({
      include: [{ model: models.Analyst, as: "analyst" }],
      where: { userId: req.user.id },
    });
    res.json(myAnalList);
  } catch (err) {
    throw err;
  }
  // res.json(myAnalList);
  // res.json({ message: "fail" });
});

router.get("/myReport", async function (req, res, next) {
  // console.log(req.body);
  // console.log(req);
  try {
    // console.log(req.user);
    const myReportList = await models.LikeReport.findAll({
      include: { model: models.Report, as: "report" },
      where: { userId: req.user.id },
    });
    // console.log(myReportList);

    let SendList = await Promise.all(
      myReportList.map(async (el) => {
        // console.log(el.dataValues.report.dataValues.firmId);
        const tempRes = await models.Firm.findOne({
          where: { id: el.dataValues.report.dataValues.firmId },
        });
        // console.log(el.dataValues.report.dataValues);
        const tempReturn = {
          report: el.dataValues.report.dataValues,
          firm: tempRes.dataValues.name,
        };
        console.log(tempReturn);
        return tempReturn;
      })
    );
    console.log(SendList);
    res.json(SendList);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
