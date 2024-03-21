const express = require("express");
const router = express.Router();
const { initModels } = require("../models/initModels");

const models = initModels();

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
