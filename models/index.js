const {initModels} = require('./initModels');
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const models = initModels(sequelize, Sequelize.DataTypes);

module.exports = models;