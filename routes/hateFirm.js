var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();

/* GET home page. */
router.post("/hateFirm", async function (req, res, next) {
  // console.log(req.body);
  const destoryResult = await models.DislikeFirm.destroy({
    where: { userId: req.body.userId, analystId: req.body.firmId },
  });
  const Firms = await models.DislikeFirm.pressHateFirm(
    req.body.userId,
    req.body.firmId
  );
  res.json(Firms);
});

router.post("/unHateReport", async function (req, res, next) {
  const Firm = await models.DislikeFirm.pressUnhateFirm(
    req.body.userId,
    req.body.firmId
  );
  res.json(Firm);
});

module.exports = router;
