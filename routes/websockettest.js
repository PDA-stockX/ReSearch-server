const express = require("express");
const router = express.Router();
const Sector = require("../models/sector");

/* GET users listing. */
router.get("/", async (req, res) => {
  const sector = await Sector.create({
    name: "John",
  });
  res.json(sector);
});

module.exports = router;
