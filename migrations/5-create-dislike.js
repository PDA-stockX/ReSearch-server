'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Dislikes', {
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
            analystId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Reports',
                        key: 'id'
                    },
                    onDelete: 'CASCADE'
                },
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
<<<<<<<< HEAD:migrations/6-create-dislike.js
              },
              updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
              }
========
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
>>>>>>>> 0d18ec5 (feat: 매일 10시 리포트 데이터 갱신하고 유저에게 메일을 보내는 기능 추가):migrations/5-create-dislike.js
        });
        static async pressHateReport(userId, reportId) {
            try {
              const likeReport = await this.create({
                userId: userId,
                reportId: reportId,
              });
              const likeReports = await this.findAll({
                reportId: reportId,
              });
              return {
                likeReportNum: likeReports.length,
              };
            } catch (err) {
              throw err;
            }
          }
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Dislikes');
    }
};