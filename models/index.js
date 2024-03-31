const {initModels} = require('./initModels');
const Sequelize = require("sequelize");
const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, process.env.NODE_ENV === "production"
        ? "../env/.env.production" : process.env.NODE_ENV === "development" ? "../env/.env.development" : "../env/.env"),
});

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