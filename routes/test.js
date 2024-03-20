// // 애널리스트 총 수익률, 총 달성률 추가
// async function updateAnalystRates() {
//   try {
//       // Analyst 테이블의 모든 레코드 가져오기
//       const analysts = await models.Analyst.findAll();

//       // Analyst 별로 업데이트 수행
//       for (const analyst of analysts) {
//           // 이미 값이 있는 경우에는 계산하지 않음
//           if (analyst.returnRate !== null && analyst.achievementScore !== null) {
//               continue;
//           }

//           // Analyst의 id에 해당하는 Report 데이터 가져오기
//           const reports = await models.Report.findAll({
//               where: {
//                   analystId: analyst.id,
//               },
//               include: {
//                   model: models.ReportSector,
//                   attributes: ['sectorName'],
//               }
//           });

//           // Report 데이터에서 returnRate와 achievementScore 합산
//           const totalReturnRate = reports.reduce((sum, report) => sum + report.returnRate, 0);
//           const totalAchievementScore = reports.reduce((sum, report) => sum + report.achievementScore, 0);

//           // returnRate와 achievementScore의 평균값 계산
//           const averageReturnRate = reports.length > 0 ? totalReturnRate / reports.length : 0;
//           const averageAchievementScore = reports.length > 0 ? totalAchievementScore / reports.length : 0;

//           // // Analyst가 쓴 리포트의 업종명을 배열로 저장
//           // const sectorNames = Array.from(new Set(reports.flatMap(report => report.ReportSectors.map(rs => rs.Sector.name))));

//           // Analyst 데이터 업데이트
//           await models.Analyst.update(
//               {
//                   returnRate: averageReturnRate,
//                   achievementScore: averageAchievementScore,
//               },
//               {
//                   where: { id: analyst.id },
//               }
//           );
//       }

//       console.log('Analyst rates calculation and update successful.');
//   } catch (error) {
//       console.error('Error updating analyst rates:', error);
//   }
// }


// // 수익률 및 달성률에 대한 정렬 기준
// async function getAnalystRankings(orderBy, res) {
//   try {

//       // updateAnalystRates 함수 호출
//       await updateAnalystRates();

//       // Analyst 테이블에서 name, firm, returnRate, achievementScore 가져오기
//       const analystData = await models.Analyst.findAll({
//           attributes: ['id', 'name', 'returnRate', 'achievementScore'],
//           include: {
//               model: models.Firm,
//               attributes: ['name'],
//               // as: 'firm',
//           },
//       });

//       // Analyst 별 업종 정보 가져오기
//       await Promise.all(analystData.map(async (analyst) => {
//           // 애널리스트가 작성한 리포트들을 모두 불러옵니다.
//           const reports = await models.Report.findAll({
//               where: { analystId: analyst.id },
//               include: {
//                   model: models.ReportSector,
//                   attributes: ['sectorName'],
//               },
//           });

//           // 리포트들에 포함된 업종명을 배열로 저장합니다.
//           const sectorNames = reports.flatMap(report => report.ReportSectors.map(rs => rs.sectorName));

//           // 중복된 업종명을 제거합니다.
//           analyst.sectorNames = Array.from(new Set(sectorNames));
//       }));

//       // Analyst에 대한 정보 정렬하기
//       const sortedAnalystData = analystData.map((analyst) => ({
//           id: analyst.id,
//           name: analyst.name,
//           firm: analyst.Firm.name,
//           returnRate: analyst.returnRate,
//           achievementScore: analyst.achievementScore,
//           sectorNames: analystSectorMap[analyst.id] || [],
//       }));

//       // Analyst 기준으로 정렬
//       const sortedAnalystRankings = sortedAnalystData.sort((a, b) => b[orderBy] - a[orderBy]);

//       res.json(sortedAnalystRankings);

//   } catch (err) {
//       console.error(`Error retrieving analyst data (${orderBy}):`, err);
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
// }


// // 애널리스트 수익률 순위 조회 : /analyst/return-rate
// router.get('/return-rate', async (req, res, next) => {
//   await getAnalystRankings('returnRate', res);
// });


// // 애널리스트 달성률 순위 조회 : /analyst/achievement-score
// router.get('/achievement-score', async (req, res, next) => {
//   await getAnalystRankings('achievementScore', res);
// });


// // 업종별 애널리스트 순위 조회 : /analyst?sector={업종명}
// router.get('/', async (req, res, next) => {
//   try {
//       // 받은 업종명
//       const sectorName = req.query.sector;

//       if (!sectorName) {
//           return res.status(400).json({ message: '업종명을 제공해야 합니다.' });
//       }

//       // 오늘 날짜
//       const today = new Date();

//       // updateAnalystRates 함수 호출
//       await updateAnalystRates();

//       // 특정 업종에 속한 애널리스트들의 리포트 가져오기
//       const analysts = await models.Analyst.findAll({
//           include: [
//               {
//                   model: models.Report,
//                   as: 'reports',
//                   where: { // 업종명이 일치하는 리포트만 가져오도록 필터링
//                       '$reports.ReportSector.sectorName$': sectorName
//                   },
//                   attributes: ['returnRate', 'achievementScore'],
//                   include: {
//                       model: models.ReportSector,
//                       as: 'ReportSector',
//                       attributes: []
//                   }
//               },
//               {
//                   model: models.Firm,
//                   as: 'firm',
//                   attributes: ['name'],
//               },
//           ],
//           attributes: ['id', 'name', 'firmId'],
//       });

//       // 각 애널리스트별로 평균 수익률과 평균 달성률 계산
//       const analystData = analysts.map(analyst => {
//           const totalReturnRate = analyst.reports.reduce((sum, report) => sum + report.returnRate, 0);
//           const totalAchievementScore = analyst.reports.reduce((sum, report) => sum + report.achievementScore, 0);
//           const averageReturnRate = analyst.reports.length > 0 ? totalReturnRate / analyst.reports.length : 0;
//           const averageAchievementScore = analyst.reports.length > 0 ? totalAchievementScore / analyst.reports.length : 0;
//           return {
//               id: analyst.id,
//               name: analyst.name,
//               firm: analyst.firm,
//               returnRate: averageReturnRate,
//               achievementScore: averageAchievementScore,
//               sector: sectorName
//           };
//       });

//       // 일단 수익률 기준으로 정렬 (가중치 적용하기로 함)
//       const sortedAnalystRankings = analystData.sort((a, b) => b.returnRate - a.returnRate);

//       res.json(sortedAnalystRankings);

//   } catch (err) {
//       console.error('Error retrieving analyst data by sector:', err);
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
// });



// // 애널리스트 즐겨찾기 순위 조회 : /analyst/follower-rank
// router.get('/follower-rank', async (req, res, next) => {
//   try {
//       // 팔로워 수를 기준으로 애널리스트 정렬
//       const rankedAnalysts = await models.Analyst.findAll({
//           attributes: ['id', 'name', 'firm'],
//           include: [
//               {
//                   model: models.User,  // Follow 테이블을 통해 User와 연결
//                   as: 'Followers',  // 팔로워들
//                   attributes: [],
//               },
//           ],
//           order: [
//               [sequelize.literal('Followers.count'), 'DESC'],  // Followers.count로 정렬
//           ],
//           group: ['Analyst.id'],  // Analyst별로 그룹화하여 팔로워 수를 계산
//       });

//       // 결과 정리
//       const followerRankings = rankedAnalysts.map((analyst) => ({
//           id: analyst.id,
//           name: analyst.name,
//           firm: analyst.firm,
//           followerCount: analyst.Followers.length,
//       }));

//       res.json(followerRankings);
//   } catch (err) {
//       console.error('Error retrieving analyst follower rankings:', err);
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
// });