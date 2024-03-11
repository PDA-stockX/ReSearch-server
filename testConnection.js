const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('re_search', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'mariadb'
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}

testConnection();