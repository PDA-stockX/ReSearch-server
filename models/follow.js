'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Follow extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId',
                onDelete: 'CASCADE'
            });
            this.belongsTo(models.Analyst, {
                as: 'analyst',
                foreignKey: 'analystId',
                onDelete: 'CASCADE'
            });
        }
    }

    Follow.init({}, {
        sequelize,
        modelName: 'Follow',
    });
    return Follow;
};