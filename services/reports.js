const {getStockPriceInfo} = require('../api/openApi');

const calculateReturnRate = async (stockName, postedAt, refPrice) => {
    const stockPriceInfo = await getPriceInfoAfterOneYear(stockName, postedAt);
    return (stockPriceInfo.clpr - refPrice) / refPrice;
}

const calculateAchievementScore = async (stockName, postedAt, refPrice, targetPrice) => {
    const stockPriceInfo = await getPriceInfoAfterOneYear(stockName, postedAt);
    const achievementRate = (stockPriceInfo.clpr - refPrice) / (targetPrice - refPrice);
    let achievementScore = 100 - Math.abs(100 - achievementRate);
    if (achievementScore < 0) {
        achievementScore = 0;
    }
    return achievementScore;
}

const getPriceInfoAfterOneYear = async (stockName, postedAt) => {
    const oneYearLater = getOneYearLater(postedAt);
    const businessDay = getBusinessDayAround(oneYearLater);
    const stockPriceInfo = await getStockPriceInfo(stockName, businessDay);
}

module.exports = {calculateReturnRate, calculateAchievementScore};