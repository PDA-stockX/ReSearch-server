const fs = require('fs');

const data = fs.readFileSync('./data/Firm.json');
const parsed = JSON.parse(data);

const firms = [];
for (const firmName of parsed) {
    firms.push({
        name: firmName,
    });
}

const models = require('../models/index');
models.Firm.bulkCreate(firms)
    .catch(err => {
        console.error(err);
    });