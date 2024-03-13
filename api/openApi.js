const axios = require('axios');
require('dotenv').config();

const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const getStockPriceInfo = async (date, stockName) => {
    try {
        const response = await axios.get(`${process.env.OPEN_API_URL}/getStockPriceInfo
                        ?serviceKey=${process.env.OPEN_API_KEY}
                        &basDt=${date}&itmsNm=${stockName}
                        &resultType=json`, config);
        return response.response.body.items.item[0];
    } catch (err) {
        throw err;
    }
}

module.exports = {getStockPriceInfo};