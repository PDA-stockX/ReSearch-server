const fs = require('fs');
const axios = require('axios');

async function saveReports() {
    const analystData = fs.readFileSync('./data/Analyst.json');
    const parsedAnalystData = JSON.parse(analystData);

    const reportData = fs.readFileSync('./data/Report.json');
    const parsedReportData = JSON.parse(reportData);

    const reportSectorsData = fs.readFileSync('./data/ReportSector.json');
    const parsedReportSectorsData = JSON.parse(reportSectorsData);

    for (let i = 0; i < parsedAnalystData.length; i++) {
        try {
            await axios.post('http://localhost:3000/reports', {
                analyst: parsedAnalystData[i],
                report: parsedReportData[i],
                reportSector: parsedReportSectorsData[i]
            });
        } catch (error) {
            console.error(`Error on iteration ${i}:`, error);
        }

    }
}

saveReports();