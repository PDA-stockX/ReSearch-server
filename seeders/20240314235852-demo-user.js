"use strict";

const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt();
    return queryInterface.bulkInsert("Users", [
      {
        name: "demo",
        nickname: "demo",
        email: "demo@example.com",
        password: await bcrypt.hash("demo1234", salt),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
