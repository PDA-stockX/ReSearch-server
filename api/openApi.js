const axios = require('axios');
const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, process.env.NODE_ENV === "production"
        ? "../env/.env.production" : process.env.NODE_ENV === "development" ? "../env/.env.development" : "../env/.env"),
});

const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const getStockPriceInfo = async (ticker, date) => {
    try {
        const response = await axios.get(`${process.env.OPEN_API_URL}/getStockPriceInfo`
            + `?serviceKey=${process.env.OPEN_API_KEY}`
            + `&likeSrtnCd=${ticker}&basDt=${date}&resultType=json`, config);
        return response.data.response.body.items.item[0];
    } catch (err) {
        throw err;
    }
}

module.exports = {getStockPriceInfo};