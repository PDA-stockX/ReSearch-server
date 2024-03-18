var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken } = require("../services/auth");
/* GET home page. */
router.post("/hateFirm", async function (req, res, next) {
  // console.log(req.body);
  const token = req.cookies["authToken"];

  const ValidToken = verifyToken(token);
  if (ValidToken) {
    const destoryResult = await models.DislikeFirm.destroy({
      where: { userId: req.body.userId, analystId: req.body.firmId },
    });
    const Firms = await models.DislikeFirm.pressHateFirm(
      req.body.userId,
      req.body.firmId
    );
    res.json(Firms);
  } else {
    res.json({ message: "fail" });
  }
});

router.post("/unHateReport", async function (req, res, next) {
  const token = req.cookies["authToken"];

  const ValidToken = verifyToken(token);
  if (ValidToken) {
    const Firm = await models.DislikeFirm.pressUnhateFirm(
      req.body.userId,
      req.body.firmId
    );
    res.json(Firm);
  } else {
    res.json({ message: "fail" });
  }
});

module.exports = router;