const {getStockPriceInfo} = require('../api/openApi');
const {getOneYearLater, getBusinessDayAround, dateToSimpleString, getOneDayAgo} = require("../utils/dateUtil");

const calculateReturnRate = async (ticker, postedAt, refPrice) => {
    const stockPriceInfo = await getPriceInfoAfterOneYear(ticker, postedAt);
    return (stockPriceInfo.clpr - refPrice) / refPrice;
}

const calculateAchievementScore = async (ticker, postedAt, refPrice, targetPrice) => {
    const stockPriceInfo = await getPriceInfoAfterOneYear(ticker, postedAt);
    const achievementRate = (stockPriceInfo.clpr - refPrice) / (targetPrice - refPrice) * 100;
    let achievementScore = 100 - Math.abs(100 - achievementRate);
    if (achievementScore < 0) {
        achievementScore = 0;
    }
    return achievementScore;
}

const getPriceInfoAfterOneYear = async (ticker, postedAt) => {
    const oneYearLater = getOneYearLater(postedAt);
    let businessDay = getBusinessDayAround(oneYearLater);

    let stockPriceInfo;
    do {
        stockPriceInfo = await getStockPriceInfo(ticker, dateToSimpleString(businessDay));
        businessDay = getOneDayAgo(businessDay);
    } while (stockPriceInfo === undefined);
    return stockPriceInfo;
}

module.exports = {calculateReturnRate, calculateAchievementScore};