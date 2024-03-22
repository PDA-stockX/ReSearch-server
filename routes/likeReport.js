var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken } = require("../services/auth");
/* GET home page. */
const { authenticate } = require("../services/auth");
/* GET home page. */

router.get("/checkLike", async function (req, res, next) {
  try {
    const response = await models.LikeReport.findOne({
      where: { userId: req.query.userId, reportId: req.query.reportId },
    });
    // console.log(response);
    if (response == null) {
      res.json({ message: "fail" });
    } else {
      res.json({ message: "success" });
    }
  } catch (err) {
    throw err;
  }
});
router.get("/checkLikeNum", async function (req, res, next) {
  try {
    const response = await models.LikeReport.findAll({
      where: { reportId: req.query.reportId },
    });
    // console.log(response);
    res.json({ likeNum: response.length });
  } catch (err) {
    throw err;
  }
});

router.use(authenticate);
router.post("/likeReport", async function (req, res, next) {
  console.log(req.body);
  try {
    const destoryResult = await models.DislikeReport.destroy({
      where: { userId: req.body.userId, reportId: req.body.reportId },
    });
    console.log(destoryResult);
    const reportLike = await models.LikeReport.create({
      userId: req.body.userId,
      reportId: req.body.reportId,
    })
      .then(() => {
        res.json({ message: "success" });
      })
      .catch((err) => {
        res.json({ message: "fail" });
      });
  } catch (err) {
    res.json({ message: "fail" });
    throw err;
  }
});

router.post("/unLikeReport", async function (req, res, next) {
  try {
    const destoryResult = await models.LikeReport.destroy({
      where: { userId: req.body.userId, reportId: req.body.reportId },
    })
      .then(() => res.json({ message: "success" }))
      .catch((err) => res.json({ message: "fail" }));
  } catch (err) {
    res.json({ message: "fail" });
  }
});

module.exports = router;
