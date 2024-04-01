const express = require("express");
const router = express.Router();

const models = require("../models/index");
const { verifyToken, authenticate } = require("../services/auth");

router.get("/my", async function (req, res, next) {
  try {
    const response = await models.DislikeReport.findOne({
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

router.get("/num", async function (req, res, next) {
  try {
    const response = await models.DislikeReport.findAll({
      where: { reportId: req.query.reportId },
    });
    // console.log(response);
    res.json({ hateNum: response.length });
  } catch (err) {
    throw err;
  }
});

router.use(authenticate);
router.post("/dislike", async function (req, res, next) {
  try {
    const destoryResult = await models.LikeReport.destroy({
      where: { userId: req.body.userId, reportId: req.body.reportId },
    });
    console.log(destoryResult);
    const reportLike = await models.DislikeReport.create({
      userId: req.body.userId,
      reportId: req.body.reportId,
    })
      .then(() => {
        res.json({ massage: "success" });
      })
      .catch((err) => {
        res.json({ message: fail });
        throw err;
      });
  } catch (err) {
    res.json({ message: "fail" });
    throw err;
  }
});

router.post("/un-dislike", async function (req, res, next) {
  try {
    const destoryResult = await models.DislikeReport.destroy({
      where: { userId: req.body.userId, reportId: req.body.reportId },
    })
      .then(() => res.json({ message: "success" }))
      .catch((err) => res.json({ message: "fail" }));
  } catch (err) {
    res.json({ message: "fail" });
  }
});

module.exports = router;
