const axios = require('axios');

const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const getStockPriceInfo = async (ticker, date) => {
    let response
    try {
        response = await axios.get(`${process.env.OPEN_API_URL}/getStockPriceInfo`
            + `?serviceKey=${process.env.OPEN_API_KEY}`
            + `&likeSrtnCd=${ticker}&basDt=${date}&resultType=json`, config);
        return response.data.response.body.items.item[0];
    } catch (err) {
        throw err;
    }
}

module.exports = {getStockPriceInfo};