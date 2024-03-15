"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Analysts", [
      {
        name: "John",
        firm: "Doe",
        returnRate: 1.0,
        achievementRate: 1.0,
        email: "test@test.com",
        photoUrl: "asdf",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Analysts", null, {});
  },
};
