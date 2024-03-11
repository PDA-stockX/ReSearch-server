const Sequelize = require("sequelize");

const sequelize = new Sequelize("re_search", "admin", "admin", {
    host: "localhost",
    dialect: "mariadb",
});

const _User = require("./user");
const _Analyst = require("./analyst");
const _Report = require("./report");
const _Sector = require("./sector");
const _Follow = require("./follow");
const _Like = require("./like");
const _Dislike = require("./dislike");
const _ReportSector = require("./reportSector");

function initModels() {
    const User = _User(sequelize, Sequelize.DataTypes);
    const Analyst = _Analyst(sequelize, Sequelize.DataTypes);
    const Report = _Report(sequelize, Sequelize.DataTypes);
    const Sector = _Sector(sequelize, Sequelize.DataTypes);
    const Follow = _Follow(sequelize, Sequelize.DataTypes);
    const Like = _Like(sequelize, Sequelize.DataTypes);
    const Dislike = _Dislike(sequelize, Sequelize.DataTypes);
    const ReportSector = _ReportSector(sequelize, Sequelize.DataTypes);

    return {
        User,
        Analyst,
        Report,
        Sector,
        Follow,
        Like,
        Dislike,
        ReportSector,
    };
}

module.exports = { initModels };