'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Report extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Analyst, {
                as: 'analyst',
                foreignKey: 'analystId',
                onDelete: 'CASCADE'
            });
            this.hasMany(models.Like, {
                as: 'likes',
                foreignKey: 'reportId',
                onDelete: 'CASCADE'
            });
            this.hasMany(models.Dislike, {
                as: 'dislikes',
                foreignKey: 'reportId',
                onDelete: 'CASCADE'
            });
        }
    }

    Report.init({
        pdfUrl: DataTypes.STRING,
        ticker: DataTypes.STRING,
        investmentOpinion: DataTypes.STRING,
        postedAt: DataTypes.DATE,
        refPrice: DataTypes.INTEGER,
        targetPrice: DataTypes.INTEGER,
        returnRate: DataTypes.FLOAT,
        achievementRate: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'Report',
    });
    return Report;
};