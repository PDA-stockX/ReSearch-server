const Sequelize = require("sequelize");

const sequelize = new Sequelize("re_search", "admin", "admin", {
    host: "localhost",
    port: 3305,
    dialect: "mariadb",
});

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

function initModels() {
    const User = _User(sequelize, Sequelize.DataTypes);
    const Firm = _Firm(sequelize, Sequelize.DataTypes);
    const Analyst = _Analyst(sequelize, Sequelize.DataTypes);
    const Report = _Report(sequelize, Sequelize.DataTypes);
    const LikeReport = _LikeReport(sequelize, Sequelize.DataTypes);
    const DislikeReport = _DislikeReport(sequelize, Sequelize.DataTypes);
    const LikeFirm = _LikeFirm(sequelize, Sequelize.DataTypes);
    const DislikeFirm = _DislikeFirm(sequelize, Sequelize.DataTypes);
    const Follow = _Follow(sequelize, Sequelize.DataTypes);
    const ReportSector = _ReportSector(sequelize, Sequelize.DataTypes);
    const StockItem = _StockItem(sequelize, Sequelize.DataTypes);

    User.associate({Follow});
    Firm.associate({Report, LikeFirm, DislikeFirm, Analyst});
    Analyst.associate({Report, Follow, Firm});
    Report.associate({Firm, Analyst, LikeReport, DislikeReport, ReportSector});
    LikeReport.associate({User, Report});
    DislikeReport.associate({User, Report});
    LikeFirm.associate({User, Firm});
    DislikeFirm.associate({User, Firm});
    Follow.associate({User, Analyst});
    ReportSector.associate({Report});

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

module.exports = {initModels};
