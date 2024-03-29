const fs = require('fs');
const iconv = require('iconv-lite');

const data1 = fs.readFileSync('./data/data_0605_20240225.csv');
const decoded1 = iconv.decode(data1, 'euc-kr');
let lines = decoded1.split('\n').slice(1);

const data2 = fs.readFileSync('./data/data_1749_20240225.csv');
const decoded2 = iconv.decode(data2, 'euc-kr');
lines = lines.concat(decoded2.split('\n').slice(1));

const stockItems = [];
for (const line of lines) {
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