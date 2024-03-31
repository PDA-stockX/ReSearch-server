const Sequelize = require("sequelize");

const _User = require("./user");
const _Analyst = require("./analyst");
const _Report = require("./report");
const _Firm = require("./firm");
const _LikeReport = require("./likeReport");
const _LikeFirm = require("./likeFirm");
const _DislikeReport = require("./dislikeReport");
const _DislikeFirm = require("./dislikeFirm");
const _Follow = require("./follow");
const _ReportSector = require("./reportSector");
const _StockItem = require("./stockItem");

function initModels(sequelize, dataTypes) {
  const User = _User(sequelize, dataTypes);
  const Firm = _Firm(sequelize, dataTypes);
  const Analyst = _Analyst(sequelize, dataTypes);
  const Report = _Report(sequelize, dataTypes);
  const LikeReport = _LikeReport(sequelize, dataTypes);
  const DislikeReport = _DislikeReport(sequelize, dataTypes);
  const LikeFirm = _LikeFirm(sequelize, dataTypes);
  const DislikeFirm = _DislikeFirm(sequelize, dataTypes);
  const Follow = _Follow(sequelize, dataTypes);
  const ReportSector = _ReportSector(sequelize, dataTypes);
  const StockItem = _StockItem(sequelize, dataTypes);

  User.associate({ Follow });
  Firm.associate({ Report, LikeFirm, DislikeFirm, Analyst });
  Analyst.associate({ Report, Follow, Firm });
  Report.associate({ Firm, Analyst, LikeReport, DislikeReport, ReportSector });
  LikeReport.associate({ User, Report });
  DislikeReport.associate({ User, Report });
  LikeFirm.associate({ User, Firm });
  DislikeFirm.associate({ User, Firm });
  Follow.associate({ User, Analyst });
  ReportSector.associate({ Report });

  return {
    User,
    Firm,
    Analyst,
    Report,
    LikeReport,
    DislikeReport,
    LikeFirm,
    DislikeFirm,
    Follow,
    ReportSector,
    StockItem,
  };
}

module.exports = { initModels };
