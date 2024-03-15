'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('DislikeFirms', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Users',
                        key: 'id'
                    },
                    onDelete: 'CASCADE'
                },
                allowNull: false
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
        await queryInterface.dropTable('DislikeFirms');
    }
};