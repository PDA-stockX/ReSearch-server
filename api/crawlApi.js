const axios = require('axios');
require('dotenv').config();

const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const fetchTodayReports = async (date, stockName) => {
    try {
        const response = await axios.get(`${process.env.CRAWLING_API_URL}`, config);
        return response.data;
    } catch (err) {
        throw err;
    }
}

module.exports = {fetchTodayReports};