const { updateReports, updateAnalysts, updateFirms, notifyUsersOfNewReports } = require('../services/schedule');
const models = require('../models/index');

describe('Schedule Service', () => {
    let todayReports;
    beforeEach(() => {
        jest.clearAllMocks();

        todayReports = [
            {
                id: 1,
                title: "삼성전자 매수 추천",
                summary: "삼성전자 주가가 120만원까지 상승할 것으로 예상됩니다.",
                ticker: "005930",
                stockName: "삼성전자",
                investmentOpinion: "BUY",
                postedAt: new Date(),
                returnRate: null,
                refPrice: 100,
                targetPrice: 120
            },
            {
                id: 2,
                postedAt: new Date(),
                returnRate: null,
                stockName: 'SK하이닉스',
                refPrice: 200,
                targetPrice: 250
            },
            {
                id: 3,
                postedAt: new Date(),
                returnRate: null,
                stockName: 'LG화학',
                refPrice: 300,
                targetPrice: 350
            }
        ];

    });

    it('should update reports', async () => {
        // Mock the models.Report.findAll and models.Report.bulkCreate methods
        models.Report.findAll = jest.fn().mockResolvedValue([]);
        models.Report.bulkCreate = jest.fn().mockResolvedValue([]);

        await updateReports();

        // Check if the mocked methods were called
        expect(models.Report.findAll).toHaveBeenCalled();
        expect(models.Report.bulkCreate).toHaveBeenCalled();
    });

    it('should update analysts', async () => {
        // Mock the models.Analyst.findAll and models.Analyst.bulkCreate methods
        models.Analyst.findAll = jest.fn().mockResolvedValue([]);
        models.Analyst.bulkCreate = jest.fn().mockResolvedValue([]);

        await updateAnalysts();

        // Check if the mocked methods were called
        expect(models.Analyst.findAll).toHaveBeenCalled();
        expect(models.Analyst.bulkCreate).toHaveBeenCalled();
    });

    it('should update firms', async () => {
        // Mock the models.Firm.findAll and models.Firm.bulkCreate methods
        models.Firm.findAll = jest.fn().mockResolvedValue([]);
        models.Firm.bulkCreate = jest.fn().mockResolvedValue([]);

        await updateFirms();

        // Check if the mocked methods were called
        expect(models.Firm.findAll).toHaveBeenCalled();
        expect(models.Firm.bulkCreate).toHaveBeenCalled();
    });

    it('should notify users of new reports', async () => {
        // Mock the models.Report.findAll, models.Follow.findAll, models.User.findByPk, models.Analyst.findAll methods
        models.Report.findAll = jest.fn().mockResolvedValue([]);
        models.Follow.findAll = jest.fn().mockResolvedValue([]);
        models.User.findByPk = jest.fn().mockResolvedValue({});
        models.Analyst.findAll = jest.fn().mockResolvedValue([]);

        await notifyUsersOfNewReports();

        // Check if the mocked methods were called
        expect(models.Report.findAll).toHaveBeenCalled();
        expect(models.Follow.findAll).toHaveBeenCalled();
        expect(models.User.findByPk).toHaveBeenCalled();
        expect(models.Analyst.findAll).toHaveBeenCalled();
    });
});