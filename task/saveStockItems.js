const fs = require('fs');
const iconv = require('iconv-lite');
require("dotenv").config({ path: "../.env" });

const data1 = fs.readFileSync('./data/data_0605_20240225.csv');
const decoded1 = iconv.decode(data1, 'euc-kr');
const lines = decoded1.split('\n');

const data2 = fs.readFileSync('./data/data_1749_20240225.csv');
const decoded2 = iconv.decode(data2, 'euc-kr');
lines.concat(decoded2.split('\n'));

const stockItems = [];
for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const [itemCode, itemName, market] = line.split(',');
    stockItems.push({
        code: itemCode.replace(/"+/g, ''),
        name: itemName.replace(/"+/g, ''),
        market: market.replace(/"+/g, '').toLowerCase(),
    })
}

const models = require('../models/index');
for (const stockItem of stockItems) {
    models.StockItem.create({
        itemCode: stockItem.code,
        itemName: stockItem.name,
        market: stockItem.market,
    }).catch(err => {
        console.error(err);
    });
}

