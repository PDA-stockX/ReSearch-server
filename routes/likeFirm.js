var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken } = require("../services/auth");
const { authenticate } = require("../services/auth");
/* GET home page. */

router.get("/checkLikeNum", async function (req, res, next) {
  try {
    const response = await models.LikeFirm.findAll({
      where: { firmId: req.query.firmId },
    });
    console.log(response);
    res.json({ likeNum: response.length });
  } catch (err) {
    throw err;
  }
});

router.use(authenticate);

router.get("/checkLike", async function (req, res, next) {
  try {
    const response = await models.LikeFirm.findOne({
      where: { userId: req.user.id, firmId: req.query.firmId },
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

router.post("/likeFirm", async function (req, res, next) {
  console.log(req.body);
  try {
    const destoryResult = await models.DislikeFirm.destroy({
      where: { userId: req.user.id, firmId: req.body.firmId },
    });
    console.log(destoryResult);
    const firmLike = await models.LikeFirm.create({
      userId: req.user.id,
      firmId: req.body.firmId,
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

router.post("/unLikeFirm", async function (req, res, next) {
  try {
    const destoryFirm = await models.LikeFirm.destroy({
      where: { userId: req.user.id, firmId: req.body.firmId },
    })
      .then(() => res.json({ message: "success" }))
      .catch((err) => res.json({ message: "fail" }));
  } catch (err) {
    res.json({ message: "fail" });
  }
});

module.exports = router;
