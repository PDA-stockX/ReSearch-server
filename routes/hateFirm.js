var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken } = require("../services/auth");
/* GET home page. */
const { authenticate } = require("../services/auth");

router.get("/checkHateNum", async function (req, res, next) {
  try {
    const response = await models.DislikeFirm.findAll({
      where: { firmId: req.query.firmId },
    });
    // console.log(response);
    res.json({ hateNum: response.length });
  } catch (err) {
    throw err;
  }
});

router.use(authenticate);

router.get("/checkHate", async function (req, res, next) {
  try {
    const response = await models.DislikeFirm.findOne({
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

router.post("/hateFirm", async function (req, res, next) {
  try {
    const destoryResult = await models.LikeFirm.destroy({
      where: { userId: req.user.id, firmId: req.body.firmId },
    });
    console.log(destoryResult);
    const reportLike = await models.DislikeFirm.create({
      userId: req.user.id,
      firmId: req.body.firmId,
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

router.post("/unHateFirm", async function (req, res, next) {
  try {
    const destoryResult = await models.DislikeFirm.destroy({
      where: { userId: req.user.id, firmId: req.body.firmId },
    })
      .then(() => res.json({ message: "success" }))
      .catch((err) => res.json({ message: "fail" }));
  } catch (err) {
    res.json({ message: "fail" });
  }
});
module.exports = router;
