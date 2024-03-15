'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Analysts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            firmId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Firms',
                        key: 'id'
                    },
                    onDelete: 'CASCADE'
                },
                allowNull: false
            },
            returnRate: {
                type: Sequelize.FLOAT
            },
            achievementScore: {
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING
            },
            photoUrl: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Analysts');
    }
};